const router = require("express").Router();

const { signUp, logIn } = require("../controllers/authController");

const {
  signUpValidator,
  logInInValidator
} = require("../utils/validator/authValidator");

/**
 * @openapi
 * /api/v1/signUp:
 *  post:
 *    summary: Register a new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: The user's email address.
 *               example: user@example.com
 *             password:
 *               type : string
 *               format: password
 *               description: The user's password (must be at least 8 characters, include lowercase, uppercase, numbers, and a symbol).
 *               example: Password@123
 *    responses:
 *      "201":
 *         description: User successfully registered, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *      "400":
 *         description: Invalid input or duplicate email.
 *         $ref: "#/components/responses/400ValidationError"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.post("/signUp", signUpValidator, signUp);

/**
 * @openapi
 * /api/v1/logIn:
 *  post:
 *    summary: Authenticate a user and get JWT token
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: The user's email address.
 *               example: user@example.com
 *             password:
 *               type: string
 *               format: password
 *               description: The user's password (must be at least 8 characters, include lowercase, uppercase, numbers, and a symbol).
 *               example: Password@123
 *    responses:
 *      "200":
 *         description: User successfully authenticated, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *      "400":
 *         description: Invalid input.
 *         $ref: "#/components/responses/400ValidationError"
 *      "401":
 *         $ref: "#/components/responses/401Unauthorized"
 *      "500":
 *         $ref: "#/components/responses/500ServerErorr"
 */
router.post("/logIn", logInInValidator, logIn);

module.exports = router;
