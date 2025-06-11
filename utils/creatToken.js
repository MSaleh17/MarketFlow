const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES
    }
  );
};
