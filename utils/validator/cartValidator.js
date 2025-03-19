const { body, param } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const addToCartValdator = [
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("productId")
    .exists()
    .withMessage("Product ID is required")
    .isInt()
    .withMessage("Product ID must be an integer"),
  validatorMiddleware
];

const getCartItemValdator = [
  param("productId", "ProductId must be a positive integer").isInt(),
  validatorMiddleware
];

const updateCartItemValdator = [
  param("productId", "ProductId must be a positive integer").isInt(),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  validatorMiddleware
];

const deleteCartItemValdator = [
  param("productId", "ProductId must be a positive integer").isInt(),
  validatorMiddleware
];

module.exports = {
  addToCartValdator: addToCartValdator,
  getCartItemValdator: getCartItemValdator,
  updateCartItemValdator: updateCartItemValdator,
  deleteCartItemValdator: deleteCartItemValdator
};
