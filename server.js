const express = require("express");
const path = require("path");
require("dotenv").config();


const sequelize = require("./utils/db");
const authRouter = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const paymetRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");
const errorMiddlewar = require("./middlewares/errorMiddlewar");

//--------------------------
const Cart = require("./models/Cart");
const CartItem = require("./models/CartItem");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const { StatusCodes } = require("http-status-codes");
//---------------------------

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
//-----------------------------------------

const app = express();

app.use("/api/v1", paymetRoute);

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/v1", authRouter);
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", orderRoute);

app.use("*", (req, res, next) => {
  next(
    new appError(
      "Invalid url",
      StatusCodes.BAD_REQUEST,
      `This url is not exist: ${req.url}`
    )
  );
});

app.use(errorMiddlewar);

sequelize
  .sync({ force: false })
  .then((res) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

process.on("unhandledRejection", (err) => {
  throw err;
});

process.on("uncaughtException", (err) => {
  console.log(`uncaught rejection: ${err.name}, ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
