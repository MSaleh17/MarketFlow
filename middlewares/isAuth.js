const jwt = require("jsonwebtoken");
const errorHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

module.exports = errorHandler(async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new appError(
      "Login fail",
      StatusCodes.UNAUTHORIZED,
      "you are not login, please login and try again"
    );
  }

  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new appError(
      "Login fail",
      StatusCodes.UNAUTHORIZED,
      "you are not login, please login and try again"
    );
  }

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedToken) {
    throw new appError(
      "Login fail",
      StatusCodes.UNAUTHORIZED,
      "you are not login, please login and try again"
    );
  }

  req.user = {
    userId: decodedToken.userId,
    email: decodedToken.email,
    role: decodedToken.role
  };
  next();
});
