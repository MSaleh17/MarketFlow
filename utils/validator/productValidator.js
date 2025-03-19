const { body, param, query } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const createProductValidator = [
  body("title", "Title required.").trim().notEmpty(),
  body("description", "Description required.").trim().notEmpty(),
  body("quantity", "Please, enter a valid quantity value")
    .notEmpty()
    .isInt({ min: 0 }),
  body("price", "Please, enter a valid price value).notEmpty()")
    .notEmpty()
    .isFloat({
      min: 0
    }),
  validatorMiddleware
];

const getProductValidator = [
  param("id", "ProductId must be a positive integer.").isInt(),
  validatorMiddleware
];

const updateProductValidator = [
  param("id", "ProductId must be a positive integer.").isInt(),
  body("title", "Title required.").optional().trim().notEmpty(),
  body("description", "Description required.").optional().trim().notEmpty(),
  body("quantity", "Please, enter a valid quantity value")
    .optional()
    .notEmpty()
    .isInt({ min: 0 }),
  body("price", "Please, enter a valid price value).notEmpty()")
    .optional()
    .notEmpty()
    .isFloat({ min: 0 }),
  validatorMiddleware
];

const deleteProductValidator = [
  param("id", "ProductId must be a positive integer.").isInt(),
  validatorMiddleware
];

const productListvalidator = [
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
module.exports = {
  createProductValidator: createProductValidator,
  updateProductValidator: updateProductValidator,
  getProductValidator: getProductValidator,
  deleteProductValidator: deleteProductValidator,
  productListvalidator: productListvalidator
};
