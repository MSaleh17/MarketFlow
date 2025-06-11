const router = require("express").Router();

const {
  productList,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const isAuth = require("../middlewares/isAuth");
const allowedTo = require("../middlewares/allowedTo");
const {
  createProductValidator,
  updateProductValidator,
  getProductValidator,
  deleteProductValidator,
  productListvalidator
} = require("../utils/validator/productValidator");

const uploadManger = require("../utils/uploadManger")("images");

/**
 * @openapi
 * /api/v1/products:
 *  get:
 *    summary: Get list of products
 *    description: Fetches a list of non-deleted products with pagination, sorted by creation date in descending order.
 *    tags: [Products]
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 25
 *        description: Number of products to return per page
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *          default: 0
 *        description: Number of products to skip for pagination
 *    responses:
 *      "200":
 *        description: List of products retrieved successfully
 *        content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/product"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.get("/products", productListvalidator, productList);

/**
 * @openapi
 * /api/v1/products/{id}:
 *  get:
 *    summary: Get product by ID
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    responses:
 *      "200":
 *        description: Product retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *               $ref: "#/components/schemas/product"
 *      "404":
 *        description: Product not found
 *      "400":
 *         description: Invalid productId.
 *         $ref: "#/components/responses/400ValidationError"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.get("/products/:id", getProductValidator, getProduct);

/**
 * @openapi
 * /api/v1/products:
 *  post:
 *    summary: Create a new product (Admin only)
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - description
 *              - quantity
 *              - price
 *            properties:
 *              title:
 *                type: string
 *                description: Product title
 *              description:
 *                type: string
 *                description: Product description
 *              quantity:
 *                type: integer
 *                description: Available quantity
 *              price:
 *                type: number
 *                format: float
 *                description: Product price
 *              image:
 *                type: string
 *                format: binary
 *                description: Product image
 *    responses:
 *      "201":
 *        description: Product created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/product"
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "403":
 *         $ref: "#/components/responses/403Forbidden"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.post(
  "/products",
  isAuth,
  allowedTo("admin"),
  createProductValidator,
  uploadManger.single("image"),
  createProduct
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *  put:
 *    summary: Update a product (Admin only)
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Product title
 *              description:
 *                type: string
 *                description: Product description
 *              quantity:
 *                type: integer
 *                description: Available quantity
 *              price:
 *                type: number
 *                description: Product price
 *              image:
 *                type: string
 *                format: binary
 *                description: Product image
 *    responses:
 *      "200":
 *        description: Product updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/product"
 *      "404":
 *        description: Product not found
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "403":
 *         $ref: "#/components/responses/403Forbidden"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 *
 */
router.put(
  "/products/:id",
  isAuth,
  allowedTo("admin"),
  updateProductValidator,
  uploadManger.single("image"),
  updateProduct
);

/**
 * @openapi
 * /api/v1/products/{id}:
 *  delete:
 *    summary: Delete a product (Admin only)
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    responses:
 *      "204":
 *        description: Product deleted successfully
 *      "404":
 *        description: Product not found
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "403":
 *         $ref: "#/components/responses/403Forbidden"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.delete(
  "/products/:id",
  isAuth,
  allowedTo("admin"),
  deleteProductValidator,
  deleteProduct
);

module.exports = router;
