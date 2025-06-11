const router = require("express").Router();

const orderController = require("../controllers/orderController");
const isAuth = require("../middlewares/isAuth");
const {
  orderListvalidator,
  getOrderValidator
} = require("../utils/validator/orderValidator");

/**
 * @openapi
 * /api/v1/orders:
 *  get:
 *    summary: Get list of user's orders
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 25
 *        description: Number of orders to return
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *          default: 0
 *        description: Number of orders to skip
 *    responses:
 *      "200":
 *        description: List of orders retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/order"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.get("/orders", isAuth, orderListvalidator, orderController.orderList);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *  get:
 *    summary: Get order by ID
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Order ID
 *    responses:
 *      "200":
 *        description: Order retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/order"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "404":
 *        description: Order not found
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 *
 *
 */
router.get("/orders/:id", isAuth, getOrderValidator, orderController.getOrder);

module.exports = router;
