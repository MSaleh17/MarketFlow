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

router.get("/products", productListvalidator, productList);
router.get("/products/:id", getProductValidator, getProduct);

router.post(
  "/products",
  isAuth,
  allowedTo("admin"),
  createProductValidator,
  uploadManger.single("image"),
  createProduct
);

router.put(
  "/products/:id",
  isAuth,
  allowedTo("admin"),
  updateProductValidator,
  uploadManger.single("image"),
  updateProduct
);

router.delete(
  "/products/:id",
  isAuth,
  allowedTo("admin"),
  deleteProductValidator,
  deleteProduct
);

module.exports = router;
