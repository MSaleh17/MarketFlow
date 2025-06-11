const router = require("express").Router();

const {
  usersList,
  getUser,
  createAdmin,
  deleteUser,
  getProfile
} = require("../controllers/userController");
const isAuth = require("../middlewares/isAuth");
const allowedTo = require("../middlewares/allowedTo");
const { signUpValidator } = require("../utils/validator/authValidator");
const {
  userListvalidator,
  getUserValidator,
  deleteUserValidator
} = require("../utils/validator/userValidator");

/**
 * @openapi
 * /api/v1/users:
 *  get:
 *    summary: Get list of users (Admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 25
 *        description: Number of users to return
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *          default: 0
 *        description: Number of users to skip
 *    responses:
 *      "200":
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 length:
 *                   type: integer
 *                   description: Number of returned users
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [customer, admin]
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
router.get("/users", isAuth, allowedTo("admin"), userListvalidator, usersList);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  get:
 *    summary: Get user by ID (Admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: User ID
 *    responses:
 *      "200":
 *        description: User retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: integer
 *                    email:
 *                      type: string
 *                    firstName:
 *                      type: string
 *                    lastName:
 *                      type: string
 *                    role:
 *                      type: string
 *                      enum: [customer, admin]
 *      "404":
 *        description: User not found
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
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
router.get("/users/:id", isAuth, allowedTo("admin"), getUserValidator, getUser);

/**
 * @openapi
 * /api/v1/users:
 *  post:
 *    summary: Create a new admin user (Admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: The admin's email address
 *              password:
 *                type: string
 *                format: password
 *                description: The admin's password (must be at least 8 characters, include lowercase, uppercase, numbers, and a symbol)
 *    responses:
 *      "201":
 *        description: Admin user created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Admin created.
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
router.post("/users", isAuth, allowedTo("admin"), signUpValidator, createAdmin);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  delete:
 *    summary: Delete a user (Admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: User ID
 *    responses:
 *      "200":
 *        description: User deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User deleted.
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
  "/users/:id",
  isAuth,
  allowedTo("admin"),
  deleteUserValidator,
  deleteUser
);

/**
 * @openapi
 * /api/v1/profile:
 *  get:
 *    summary: Get current user's profile
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      "200":
 *        description: User profile retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: integer
 *                email:
 *                  type: string
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                role:
 *                  type: string
 *                  enum: [customer, admin]
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.get("/profile", isAuth, getProfile);

module.exports = router;
