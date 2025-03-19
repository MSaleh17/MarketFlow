const asyncHandler = require("express-async-handler");

const Product = require("../models/Product");
const deleteFile = require("../utils/deleteFile");
const { StatusCodes } = require("http-status-codes");

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    title: req.body.title,
    description: req.body.description,
    photoUrl: req?.file?.path,
    quantity: req.body.quantity,
    price: req.body.price
  });

  return res.status(StatusCodes.CREATED).json(product);
});

const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({
    where: {
      productId: productId
    }
  });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).send();
  }

  return res.status(StatusCodes.OK).json({ product: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const file = req?.file;

  const product = await Product.findOne({
    where: {
      productId: productId
    }
  });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).send();
  }

  if (file) {
    await deleteFile(product.photoUrl);
  }

  product.title = req.body.title || product.title;
  product.description = req.body.description || product.description;
  product.photoUrl = file?.path || product.photoUrl;
  product.quantity = req.body.quantity || product.quantity;
  product.price = req.body.price || product.price;

  await product.save();

  return res.status(StatusCodes.OK).json({ product: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({
    where: {
      productId: productId
    }
  });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).send();
  }

  product.isDeleted = true;
  await product.save();

  return res.status(StatusCodes.NO_CONTENT).send();
});

const productList = asyncHandler(async (req, res) => {
  const limit = req.query?.limit || 25;
  const offset = req.query?.limit || 0;

  const products = await Product.findAll({
    where: {
      isDeleted: false
    },
    offset: offset,
    limit: limit
  });
  return res.status(StatusCodes.OK).json(products);
});

module.exports = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  getProduct: getProduct,
  deleteProduct: deleteProduct,
  productList: productList
};
