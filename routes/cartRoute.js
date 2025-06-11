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

/**
 * @openapi
 * /api/v1/cart:
 *  get:
 *    summary: Get current user's cart
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      "200":
 *        description: Cart retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/cart"
 *      "404":
 *        description: Cart not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type : string
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.get("/cart", isAuth, getCart);

/**
 * @openapi
 * /api/v1/cart/items:
 *  post:
 *    summary: Add item to cart
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *              - quantity
 *            properties:
 *              productId:
 *                type: integer
 *                description: ID of the product to add
 *              quantity:
 *                type: integer
 *                minimum: 1
 *                description: Quantity of the product
 *    responses:
 *      "201":
 *        description: Item added to cart successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/cartItem"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "403":
 *         $ref: "#/components/responses/403Forbidden"
 *      "404":
 *        description: Product not found
 *      "409":
 *        description: Item already in cart
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.post("/cart/items", isAuth, addToCartValdator, addToCart);

/**
 * @openapi
 * /api/v1/cart/items/{productId}:
 *  get:
 *    summary: Get cart item by product ID
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    responses:
 *      "200":
 *        description: Cart item retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/cartItem"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "404":
 *        description: Cart or Cart item not found or product unavailable
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.get("/cart/items/:productId", isAuth, getCartItemValdator, getCartItem);

/**
 * @openapi
 * /api/v1/cart/items/{productId}:
 *  put:
 *    summary: Update cart item quantity
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - quantity
 *            properties:
 *              quantity:
 *                type: integer
 *                minimum: 1
 *                description: New quantity of the product
 *    responses:
 *      "200":
 *        description: Cart item updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/cartItem"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "404":
 *        description: Cart or Cart item not found or product unavailable
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.put(
  "/cart/items/:productId",
  isAuth,
  updateCartItemValdator,
  updateCartItem
);

/**
 * @openapi
 * /api/v1/cart/items/{productId}:
 *  delete:
 *    summary: Remove item from cart
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    responses:
 *      "200":
 *        description: Item removed from cart successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/cartItem"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "404":
 *        description: Cart or Cart item not found or product unavailable
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 *
 */
router.delete(
  "/cart/items/:productId",
  isAuth,
  deleteCartItemValdator,
  deleteCartItem
);

/**
 * @openapi
 *
 * /api/v1/cart:
 *  put:
 *    summary: Clear the user's cart
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      "204":
 *        description: Cart cleared successfully, no content returned
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "404":
 *        description: Cart not found for the user
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.put("/cart", isAuth, clearCart);
module.exports = router;
