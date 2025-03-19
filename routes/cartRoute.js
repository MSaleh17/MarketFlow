const router = require("express").Router();

const {
  getCart,
  addToCart,
  getCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require("../controllers/cartController");
const isAuth = require("../middlewares/isAuth");
const {
  addToCartValdator,
  getCartItemValdator,
  updateCartItemValdator,
  deleteCartItemValdator
} = require("../utils/validator/cartValidator");

router.get("/cart", isAuth, getCart);

router.post("/cart/items", isAuth, addToCartValdator, addToCart);
router.get("/cart/items/:productId", isAuth, getCartItemValdator, getCartItem);

router.put(
  "/cart/items/:productId",
  isAuth,
  updateCartItemValdator,
  updateCartItem
);

router.delete(
  "/cart/items/:productId",
  isAuth,
  deleteCartItemValdator,
  deleteCartItem
);

router.put("/cart", isAuth, clearCart);
module.exports = router;
