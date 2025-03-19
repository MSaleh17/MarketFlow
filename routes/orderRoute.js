const router = require("express").Router();

const orderController = require("../controllers/orderController");
const isAuth = require("../middlewares/isAuth");
const {
  orderListvalidator,
  getOrderValidator
} = require("../utils/validator/orderValidator");

router.get("/orders", isAuth, orderListvalidator, orderController.orderList);
router.get("/orders/:id", isAuth, getOrderValidator, orderController.getOrder);

module.exports = router;
