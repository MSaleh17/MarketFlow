const { StatusCodes } = require("http-status-codes");
const appError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new appError(
        "Unauthorized",
        StatusCodes.FORBIDDEN,
        `User ${req.user.email} not allowed to access this url.`
      );
    }
    next();
  };
};
