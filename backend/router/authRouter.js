const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

// Request OTP for signup
router.post("/signup/request-otp", authController.requestSignupOtp);

// Confirm OTP & create user
router.post("/signup/confirm-otp", authController.confirmSignupOtp);

// Signin
router.post("/signin", authController.signin);

module.exports = router;
