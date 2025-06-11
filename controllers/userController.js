const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const appError = require("../utils/appError");

const saltRounds = 12;

//admin only
const usersList = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query?.limit) || 25;
  const offset = parseInt(req.query?.offset) || 0;

  const { count, rows } = await User.findAndCountAll({
    attributes: ["userId", "email", "firstName", "lastName", "role"],
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]]
  });

  return res.status(StatusCodes.OK).json({
    totalUsers: count,
    length: rows.length,
    data: rows
  });
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

  if (!user) {
    throw new appError(
      "User not found",
      StatusCodes.NOT_FOUND,
      `No user found with ID ${userId}.`
    );
  }

  return res.status(StatusCodes.OK).json({ data: user });
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
