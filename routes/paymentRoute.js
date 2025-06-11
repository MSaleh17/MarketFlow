const router = require("express").Router();
const express = require("express");

const paymentController = require("../controllers/paymentController");
const isAuth = require("../middlewares/isAuth");
const {
  createCheckoutSessionValidator
} = require("../utils/validator/paymentValidator");

/**
 * @openapi
 * /api/v1/webhook:
 *  post:
 *    summary: Handle Stripe webhook events
 *    tags: [Payment]
 *    parameters:
 *      - in: header
 *        name: stripe-signature
 *        schema:
 *          type: string
 *        required: true
 *        description: Stripe signature for verifying the webhook event
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: Unique identifier for the Stripe event
 *              type:
 *                type: string
 *                description: Type of the Stripe event
 *              data:
 *                type: object
 *                description: Event data containing details specific to the event type
 *                properties:
 *                  object:
 *                    type: object
 *                    description: The Stripe object related to the event
 *                    properties:
 *                      metadata:
 *                        type: object
 *                        description: Metadata provided during checkout
 *    responses:
 *      "200":
 *        description: Webhook processed successfully
 *      "400":
 *        description: Invalid stripe signature
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type : string
 *      "500":
 *        $ref: "#/components/responses/500ServerErorr"
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webHook
);

/**
 * @openapi
 * /api/v1/checkout:
 *  post:
 *    summary: Create Stripe checkout session
 *    tags: [Payment]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - successUrl
 *              - cancelUrl
 *            properties:
 *              successUrl:
 *                type: string
 *                format: uri
 *                description: URL to redirect after successful payment
 *              cancelUrl:
 *                type: string
 *                format: uri
 *                description: URL to redirect if payment is cancelled
 *    responses:
 *      "200":
 *        description: Checkout session created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                url:
 *                  type: string
 *                  description: Stripe checkout URL
 *                id:
 *                  type: string
 *                  description: Stripe session ID
 *      "404":
 *        description: Cart not found or Proudct not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      "409":
 *        description: Insufficient stock
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      "400":
 *         description: Invalid input or Cart empty.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/validationError"
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.use(express.json());
router.post(
  "/checkout",
  isAuth,
  createCheckoutSessionValidator,
  paymentController.createCheckoutSession
);

module.exports = router;
