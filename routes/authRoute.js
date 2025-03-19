const router = require("express").Router();

const { signUp, longIn } = require("../controllers/authController");

const {
  signUpValidator,
  logInInValidator
} = require("../utils/validator/authValidator");

router.post("/signUp", signUpValidator, signUp);
router.post("/logIn", logInInValidator, longIn);

module.exports = router;
