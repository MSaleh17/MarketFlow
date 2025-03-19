const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: result.array()
    });
  }
  next();
};
