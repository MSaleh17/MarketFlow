const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const db = require("../utils/db");
const appError = require("../utils/appError");

const createOrder = asyncHandler(async (data) => {
  const { cartId, rawReserved } = data;

  if (!cartId || !rawReserved) {
    throw new appErrorError(
      "Invalid order data",
      StatusCodes.NOT_FOUND,
      "missing cartId or reservedProducts"
    );
  }

  const reservedProducts = JSON.parse(rawReserved);

  await db.transaction(async (t) => {
    const cart = await Cart.findOne(
      {
        where: { cartId: cartId },
        include: [{ model: CartItem, include: Product }]
      },
      { transaction: t }
    );

    if (!cart) {
      throw new appError("Not Found", StatusCodes.NOT_FOUND, "Cart not found");
    }

    const order = await Order.create(
      {
        userId: cart.userId,
        total: cart.total
      },
      { transaction: t }
    );

    const products = reservedProducts.map(async (product) => {
      Product.decrement("reservedQuantity", {
        by: product.reservedQuantity,
        where: { productId: product.productId },
        transaction: t
      });
    });
    const items = cart.CartItems.map(async (cartItem) => {
      OrderItem.create(
        {
          orderId: order.orderId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          productTitle: cartItem.Product.title,
          price: cartItem.pricePerItem
        },
        { transaction: t }
      );
    });

    await Promise.all(products);
    await Promise.all(items);

    await CartItem.destroy(
      {
        where: { cartId: cart.cartId }
      },
      { transaction: t }
    );

    await cart.update({ total: 0 }, { transaction: t });
  });
});

const orderList = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;
  const userId = req.user.userId;

  const orders = await Order.findAll({
    where: {
      userId: userId
    },
    include: [OrderItem],
    offset: offset,
    limit: limit
  });

  return res.status(StatusCodes.OK).json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.userId;

  const order = await Order.findOne({
    where: {
      orderId: orderId,
      userId: userId
    },
    include: [OrderItem]
  });
  return res.status(StatusCodes.OK).json(order);
});
module.exports = {
  createOrder: createOrder,
  orderList: orderList,
  getOrder: getOrder
};
