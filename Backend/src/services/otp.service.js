const Otp = require("../models/Otp");
const smsService = require("./sms.service");
const env = require("../config/env");

class OtpService {
  /**
   * Generate and send OTP to phone
   * @param {Object} param0
   * @param {string} param0.phone
   * @param {string} [param0.email]
   * @param {string} [param0.purpose="PHONE_VERIFICATION"]
   */
  async sendOtp({ phone, email, purpose = "PHONE_VERIFICATION" }) {
    if (!phone) {
      const err = new Error("Phone number is required to send OTP");
      err.statusCode = 400;
      throw err;
    }

    // Invalidate previous unverified OTPs for this phone and purpose
    await Otp.deleteMany({ phone, purpose, isVerified: false });

    // Generate 6-digit OTP
    const otpCode = smsService.generateOtp(6);

    // 10 minutes expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpRecord = await Otp.create({
      phone,
      email: email || "",
      otp: otpCode,
      purpose,
      attempts: 0,
      isVerified: false,
      expiresAt
    });

    // Send SMS
    const smsResult = await smsService.sendVerificationOtp(phone, otpCode);

    return {
      success: true,
      phone,
      expiresInMinutes: 10,
      message: `Verification code sent to ${phone}`,
      // Provide devOtp when not in strict production mode to assist testing and demo
      devOtp: env.nodeEnv !== "production" ? otpCode : undefined
    };
  }

  /**
   * Verify an OTP provided by the user
   * @param {Object} param0
   * @param {string} param0.phone
   * @param {string} param0.otp
   * @param {string} [param0.purpose="PHONE_VERIFICATION"]
   */
  async verifyOtp({ phone, otp, purpose = "PHONE_VERIFICATION" }) {
    if (!phone || !otp) {
      const err = new Error("Phone number and OTP code are required");
      err.statusCode = 400;
      throw err;
    }

    const trimmedOtp = otp.trim();
    const cleanPhone = phone.trim();

    // Find the latest pending OTP record
    const otpDoc = await Otp.findOne({
      phone: cleanPhone,
      purpose,
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      const err = new Error("No active verification code found for this phone number. Please request a new code.");
      err.statusCode = 400;
      throw err;
    }

    // Check expiration
    if (new Date() > otpDoc.expiresAt) {
      await Otp.deleteOne({ _id: otpDoc._id });
      const err = new Error("Verification code has expired. Please request a new code.");
      err.statusCode = 400;
      throw err;
    }

    // Rate limiting: max 5 attempts
    if (otpDoc.attempts >= 5) {
      await Otp.deleteOne({ _id: otpDoc._id });
      const err = new Error("Too many failed attempts. Please request a new verification code.");
      err.statusCode = 429;
      throw err;
    }

    // Validate code
    if (otpDoc.otp !== trimmedOtp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      const remaining = 5 - otpDoc.attempts;
      const err = new Error(`Incorrect verification code. ${remaining} attempts remaining.`);
      err.statusCode = 400;
      throw err;
    }

    // Success: Mark as verified and remove
    otpDoc.isVerified = true;
    await otpDoc.save();
    await Otp.deleteOne({ _id: otpDoc._id });

    return {
      success: true,
      message: "Phone number verified successfully"
    };
  }
}

module.exports = new OtpService();
