const { param, query } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const userListvalidator = [
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

const getUserValidator = [
  param("id", "UserId must be a positive integer.").isInt(),
  validatorMiddleware
];

const deleteUserValidator = [
  param("id", "UserId must be a positive integer.").isInt(),
  validatorMiddleware
];

module.exports = {
  userListvalidator: userListvalidator,
  getUserValidator: getUserValidator,
  deleteUserValidator: deleteUserValidator
};
