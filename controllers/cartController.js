const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const db = require("../utils/db");
const appError = require("../utils/appError");

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({
    where: { userId: userId },
    include: [
      {
        model: CartItem,
        include: Product
      }
    ]
  });

  if (!cart) {
    throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
  }

  return res.status(StatusCodes.OK).json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { quantity, productId } = req.body;

  const cartItem = await db.transaction(async (t) => {
    let [product, cart] = await Promise.all([
      Product.findOne({
        where: { productId: productId },
        transaction: t
      }),
      Cart.findOne({ where: { userId: userId }, transaction: t })
    ]);

    if (!product) {
      throw new appError(
        "Not found",
        StatusCodes.NOT_FOUND,
        "Product not found"
      );
    }

    if (!cart)
      cart = await Cart.create(
        { userId: userId, total: 0.0 },
        { transaction: t }
      );

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.cartId,
        productId: productId
      },
      transaction: t
    });

    if (cartItem) {
      throw new appError(
        "Conflict",
        StatusCodes.CONFLICT,
        "This item is already in your cart"
      );
    }

    cartItem = await CartItem.create(
      {
        cartId: cart.cartId,
        productId: productId,
        quantity: quantity
      },
      { transaction: t }
    );

    const itemTotal = parseFloat(product.price) * Number(quantity);
    cart.total = parseFloat(cart.total) + itemTotal;
    await cart.save({ transaction: t });
    return cartItem;
  });

  return res.status(StatusCodes.CREATED).json(cartItem);
});

const getCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;

  const cart = await Cart.findOne({ where: { userId: userId } });
  if (!cart) {
    throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
  }

  const cartItem = await CartItem.findOne({
    where: { cartId: cart.cartId, productId: productId },
    include: Product
  });

  if (!cartItem || !cartItem.Product) {
    throw new appError(
      "Not Found",
      StatusCodes.NOT_FOUND,
      "Cart item not found or product unavailable"
    );
  }

  return res.status(StatusCodes.OK).json(cartItem);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;
  const quantity = req.body.quantity;

  const updatedCartItem = await db.transaction(async (t) => {
    const cart = await Cart.findOne({
      where: { userId: userId },
      transaction: t
    });
    if (!cart) {
      throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.cartId, productId: productId },
      include: Product,
      transaction: t
    });

    if (!cartItem || !cartItem.Product) {
      throw new appError(
        "Not Found",
        StatusCodes.NOT_FOUND,
        "Cart item not found or product unavailable"
      );
    }

    cartItem.quantity = quantity;

    const oldItemTotal =
      parseFloat(cartItem.Product.price) * Number(cartItem.quantity);
    const curItemTotal = parseFloat(cartItem.Product.price) * Number(quantity);
    cart.total = parseFloat(cart.total) + curItemTotal - oldItemTotal;

    await cartItem.save({ transaction: t });
    await cart.save({ transaction: t });

    return cartItem;
  });

  return res.status(StatusCodes.OK).json(updatedCartItem);
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;

  const deletedItem = await db.transaction(async (t) => {
    const cart = await Cart.findOne({
      where: { userId: userId },
      transaction: t
    });
    if (!cart) {
      throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.cartId, productId: productId },
      include: Product,
      transaction: t
    });

    if (!cartItem || !cartItem.Product) {
      throw new appError(
        "Not Found",
        StatusCodes.NOT_FOUND,
        "Cart item not found or product unavailable"
      );
    }

    const itemTotal =
      parseFloat(cartItem.Product.price) * Number(cartItem.quantity);
    cart.total = parseFloat(cart.total) - itemTotal;

    await cartItem.destroy({ transaction: t });
    await cart.save({ transaction: t });
    return cartItem;
  });

  return res.status(StatusCodes.OK).json(deletedItem);
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await db.transaction(async (t) => {
    const cart = await Cart.findOne({
      where: { userId: userId },
      transaction: t
    });
    if (!cart) {
      throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
    }

    await CartItem.destroy(
      {
        where: { cartId: cart.cartId }
      },
      { transaction: t }
    );

    cart.total = 0;
    await cart.save({ transaction: t });
  });

  return res.status(StatusCodes.NO_CONTENT).send();
});

module.exports = {
  getCart: getCart,
  addToCart: addToCart,
  getCartItem: getCartItem,
  updateCartItem: updateCartItem,
  deleteCartItem: deleteCartItem,
  clearCart: clearCart
};
