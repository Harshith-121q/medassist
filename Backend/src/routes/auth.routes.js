const express = require("express");
const router = express.Router();

const {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  getMe,
  refreshToken
} = require("../controllers/auth.controller");

const {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshSchema
} = require("../validators/auth.validator");

const { validate } = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", validate(refreshSchema), refreshToken);

// Protected routes
router.get("/me", authenticate, getMe);

module.exports = router;
