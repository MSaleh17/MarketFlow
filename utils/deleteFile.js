const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async (url) => {
  const filePath = path.join(__dirname, "..", url);
  await fs.unlink(filePath);
});
