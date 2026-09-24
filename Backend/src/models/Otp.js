const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      trim: true
    },
    purpose: {
      type: String,
      enum: ["PHONE_VERIFICATION", "PASSWORD_RESET", "LOGIN_2FA"],
      default: "PHONE_VERIFICATION"
    },
    attempts: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: Mongoose/MongoDB will automatically delete document when expiresAt is reached
      index: { expires: 0 }
    }
  },
  {
    timestamps: true
  }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
