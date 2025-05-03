const router = require("express").Router();

const { signUp, logIn } = require("../controllers/authController");

const {
  signUpValidator,
  logInInValidator
} = require("../utils/validator/authValidator");

router.post("/signUp", signUpValidator, signUp);
router.post("/logIn", logInInValidator, logIn);

module.exports = router;
