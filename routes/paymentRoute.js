const router = require("express").Router();
const express = require("express");

const paymentController = require("../controllers/paymentController");
const isAuth = require("../middlewares/isAuth");
const {
  createCheckoutSessionValidator
} = require("../utils/validator/paymentValidator");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webHook
);

router.use(express.json());
router.post(
  "/checkout",
  isAuth,
  createCheckoutSessionValidator,
  paymentController.createCheckoutSession
);

module.exports = router;
