const router = require("express").Router();

const {
  usersList,
  getUser,
  createAdmin,
  deleteUser,
  getProfile
} = require("../controllers/userController");
const isAuth = require("../middlewares/isAuth");
const allowedTo = require("../middlewares/allowedTo");
const { signUpValidator } = require("../utils/validator/authValidator");
const {
  userListvalidator,
  getUserValidator,
  deleteUserValidator
} = require("../utils/validator/userValidator");

router.get("/users", isAuth, allowedTo("admin"), userListvalidator, usersList);

router.get("/users/:id", isAuth, allowedTo("admin"), getUserValidator, getUser);

router.post("/users", isAuth, allowedTo("admin"), signUpValidator, createAdmin);

router.delete(
  "/users/:id",
  isAuth,
  allowedTo("admin"),
  deleteUserValidator,
  deleteUser
);

//----------------------

router.get("/profile", isAuth, getProfile);

module.exports = router;
