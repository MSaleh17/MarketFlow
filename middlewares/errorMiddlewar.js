const { StatusCodes } = require("http-status-codes");
const appError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  console.log(err);

  if (err instanceof appError) {
    return res.status(err.httpStatusCode).json({ message: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Something went wrong" });
};
