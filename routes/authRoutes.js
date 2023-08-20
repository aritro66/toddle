const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { verify } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verify, logoutUser);

module.exports = router;
