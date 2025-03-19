const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

//admin only
const usersList = asyncHandler(async (req, res) => {
  const limit = req.query?.limit || 25;
  const offset = req.query?.offset || 0;

  const data = await User.findAll({
    attributes: ["userId", "email", "firstName", "lastName", "role"],
    offset: offset,
    limit: limit
  });

  return res.status(StatusCodes.OK).json(data);
});

// admin only
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({
    where: {
      userId: userId
    },
    attributes: ["userId", "email", "firstName", "lastName", "role"]
  });

  delete user.dataValues.password;
  return res.status(StatusCodes.OK).json({ user: user });
});

//admin only
const createAdmin = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    email: email,
    password: hashedPassword,
    role: "admin"
  });

  return res.status(StatusCodes.CREATED).json({ message: "Admin created." });
});

// for admin
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  await User.destroy({
    where: {
      userId: userId
    }
  });

  return res.status(StatusCodes.OK).json({ message: "User deleted." });
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({
    where: {
      userId: userId
    }
  });

  delete user.dataValues.password;
  return res.status(StatusCodes.OK).json({ user: user });
});

module.exports = {
  usersList: usersList,
  getUser: getUser,
  createAdmin: createAdmin,
  deleteUser: deleteUser,
  getProfile: getProfile
};
