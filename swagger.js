const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MarketFlow",
      version: "1.0.0"
    }
  },
  apis: ["./routes/*.js", "./swagger.js"]
};

const swaggerSpec = swaggerJsdoc(options);


/**
 * @openapi
 * 
 * components: 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     product:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         photoUrl:
 *           type: string
 *           description: URL of the product image
 *         quantity:
 *           type: integer
 *         reservedQuantity:
 *           type: integer
 *           description: Quantity reserved for orders
 *         price:
 *           type: number
 *           format: float
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     cart: 
 *       type: object
 *       properties:
 *         cartId:
 *           type: integer
 *         userId:
 *           type: integer
 *         total:
 *           type: number
 *         CartItems:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/cartItem"
 *     cartItem:
 *       type: object
 *       properties:
 *         cartId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         Product:
 *           $ref: "#/components/schemas/product"
 * 
 *     orderItem:
 *       type: object
 *       properties:
 *         orderId:
 *           type: integer
 *         productId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         productTitle:
 *           type: string
 *         price:
 *           type: number
 *           format: double
 *     
 *     order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: integer
 *         userId:
 *           type: integer
 *         total:
 *           type: number
 *           format: double
 *         OrderItems:
 *           type: array
 *           items:
 *              $ref: "#/components/schemas/orderItem"
 *   
 *     validationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               value:
 *                 type: string
 *               msg:
 *                 type: string
 *               path:
 *                 type: string
 *               location:
 *                 type: string
 *               example:
 *                 type: field
 *                 value: userexample.com
 *                 msg: Not a valid e-mail address
 *                 path: email
 *                 location: body
 * 
 *   responses:
 *     400ValidationError:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/validationError"
 *             
 *     401Unauthorized:
 *       description: Authentication failed.
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403Forbidden:
 *       description: Forbidden - User not authorized as admin
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 * 
 *     500ServerErorr:
 *       description: Server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 * 
 */

module.exports = swaggerSpec;
