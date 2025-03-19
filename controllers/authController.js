const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const appError = require("../utils/appError");

const saltRounds = 12;

const signUp = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    email: email,
    password: hashedPassword
  });

  const token = creatToken(user);
  return res.status(StatusCodes.CREATED).json({ token: token });
});

const longIn = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    where: {
      email: email
    }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new appError(
      "Login failed",
      StatusCodes.UNAUTHORIZED,
      "email or password is not correct."
    );
  }

  const token = creatToken(user);
  return res.status(StatusCodes.OK).json({ token: token });
});

module.exports = {
  signUp: signUp,
  longIn: longIn
};

const creatToken = (user) => {
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
