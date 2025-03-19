const { param, query } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const orderListvalidator = [
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Limit must be a positive integer."),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer."),
  validatorMiddleware
];

const getOrderValidator = [
  param("id", "UserId must be a positive integer.").isInt(),
  validatorMiddleware
];

module.exports = {
  orderListvalidator: orderListvalidator,
  getOrderValidator: getOrderValidator
};
