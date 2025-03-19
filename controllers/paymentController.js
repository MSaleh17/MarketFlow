const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const orderController = require("./orderController");
const db = require("../utils/db");
const appError = require("../utils/appError");

const toCent = 100;

const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const userEmail = req.user.email;
  const successUrl = req.body.successUrl;
  const cancelUrl = req.body.cancelUrl;

  const session = await db.transaction(async (t) => {
    const cart = await Cart.findOne(
      {
        where: { userId: userId },
        include: [
          {
            model: CartItem,
            include: Product
          }
        ]
      },
      { transaction: t }
    );

    if (!cart) {
      throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
    }

    if (!cart.CartItems?.length) {
      throw new appError(
        "Empty Cart",
        StatusCodes.BAD_REQUEST,
        "Cart is empty"
      );
    }

    const cart_line_items = [];
    const reservedProducts = [];
    const quantityUpdates = [];

    for (const cartItem of cart.CartItems) {
      const product = cartItem.Product;
      if (product.isDeleted) {
        throw new appError(
          "Not found",
          StatusCodes.NOT_FOUND,
          `${product.title} is unavailable`
        );
      }
      if (cartItem.quantity > product.quantity) {
        throw new appError(
          "Insufficient Stock",
          StatusCodes.CONFLICT,
          `${product.title} only has ${product.quantity} units available`
        );
      }

      cart_line_items.push({
        price_data: {
          currency: "USD",
          unit_amount: product.price * toCent,
          product_data: {
            name: product.title,
            description: product.description,
            images: [product.photoUrl]
          }
        },
        quantity: cartItem.quantity
      });

      reservedProducts.push({
        productId: cartItem.productId,
        reservedQuantity: cartItem.quantity
      });

      quantityUpdates.push(async () => {
        product.decrement("quantity", {
          by: cartItem.quantity,
          transaction: t
        }),
          product.increment("reservedQuantity", {
            by: cartItem.quantity,
            transaction: t
          });
      });
    }

    await Promise.all(quantityUpdates);

    const session = await stripe.checkout.sessions.create({
      line_items: cart_line_items,
      customer_email: userEmail,
      mode: "payment",
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        cartId: cart.cartId,
        reservedProducts: JSON.stringify(reservedProducts)
      }
    });

    return session;
  });

  return res.status(StatusCodes.OK).json({ url: session.url, id: session.id });
});

const webHook = asyncHandler(async (req, res) => {
  const sig = req.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid signature"
    });
  }

  //make it Idempote

  switch (event.type) {
    case "checkout.session.completed":
      await orderController.createOrder(event.data.object.metadata);
      break;
    case "checkout.session.expired":
      await freeReservedProducts(event.data.object.metadata?.reservedProducts);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(StatusCodes.OK).send();
});

const freeReservedProducts = asyncHandler(async (reservedProducts) => {
  if (!reservedProducts) {
    throw new Error("Missing reservedProducts data");
  }

  reservedProducts = JSON.parse(reservedProducts);
  await db.transaction(async (t) => {
    const products = reservedProducts.map(async (product) => {
      Product.decrement("reservedQuantity", {
        by: product.reservedQuantity,
        where: { productId: product.productId },
        transaction: t
      });
      Product.increment("quantity", {
        by: product.reservedQuantity,
        where: { productId: product.productId },
        transaction: t
      });
    });

    await Promise.all(products);
  });
});

module.exports = {
  createCheckoutSession: createCheckoutSession,
  webHook: webHook
};
