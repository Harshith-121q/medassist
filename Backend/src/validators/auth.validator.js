const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
  phone: z
    .string({ required_error: "Mobile number is required for OTP verification" })
    .trim()
    .min(8, "Please enter a valid mobile number (at least 8 digits)")
    .max(20, "Mobile number cannot exceed 20 characters")
});

const verifyOtpSchema = z.object({
  phone: z
    .string({ required_error: "Mobile phone number is required" })
    .trim()
    .min(8, "Valid mobile number is required"),
  otp: z
    .string({ required_error: "Verification OTP code is required" })
    .trim()
    .length(6, "Verification code must be exactly 6 digits")
});

const resendOtpSchema = z.object({
  phone: z
    .string({ required_error: "Mobile phone number is required" })
    .trim()
    .min(8, "Valid mobile number is required")
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
});

const refreshSchema = z.object({
  refreshToken: z.string().trim().optional()
});

module.exports = {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshSchema
};
