const { body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const createCheckoutSessionValidator = [
  body("successUrl", "successUrl is required.").exists().isURL(),
  body("cancelUrl", "cancelUrl is required.").exists().isURL(),
  validatorMiddleware
];
module.exports = {
  createCheckoutSessionValidator: createCheckoutSessionValidator
};
