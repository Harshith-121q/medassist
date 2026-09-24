const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Session = require("../models/Session");
const otpService = require("./otp.service");
const env = require("../config/env");

class AuthService {
  /**
   * Hash a plain password using bcryptjs
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare plain password with hashed password
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT Access Token
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      env.jwt.secret,
      {
        expiresIn: env.jwt.expiresIn
      }
    );
  }

  /**
   * Generate JWT Refresh Token
   */
  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id,
        type: "refresh"
      },
      env.jwt.refreshSecret,
      {
        expiresIn: env.jwt.refreshExpiresIn
      }
    );
  }

  /**
   * Create a new session in database
   */
  async createSession({ userId, token, expiresAt, userAgent, ipAddress }) {
    return Session.create({
      user: userId,
      token,
      expiresAt,
      isRevoked: false,
      userAgent: userAgent || "",
      ipAddress: ipAddress || ""
    });
  }

  /**
   * Validate session token from database
   */
  async validateSession(token) {
    if (!token) return null;

    const session = await Session.findOne({ token, isRevoked: false });
    if (!session) return null;

    if (new Date() > session.expiresAt) {
      session.isRevoked = true;
      await session.save();
      return null;
    }

    return session;
  }

  /**
   * Revoke/invalidate session by token
   */
  async revokeSession(token) {
    if (!token) return;
    await Session.updateOne({ token }, { isRevoked: true });
  }

  /**
   * Public patient registration with Mobile OTP dispatch
   */
  async registerPatient({ name, email, password, phone }) {
    const cleanPhone = phone?.trim();
    if (!cleanPhone) {
      const error = new Error("Mobile phone number is required for registration and verification");
      error.statusCode = 400;
      throw error;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      const error = new Error("User with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    // Check existing phone
    const existingPhone = await User.findOne({ phone: cleanPhone });
    if (existingPhone && existingPhone.isPhoneVerified) {
      const error = new Error("A verified account with this mobile number already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await this.hashPassword(password);

    let user;
    if (existingPhone && !existingPhone.isPhoneVerified) {
      // Re-use unverified user record with updated details
      existingPhone.name = name;
      existingPhone.email = email;
      existingPhone.password = hashedPassword;
      existingPhone.role = "PATIENT";
      existingPhone.isActive = true;
      existingPhone.isPhoneVerified = false;
      user = await existingPhone.save();
    } else {
      // Create fresh User record
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone: cleanPhone,
        role: "PATIENT",
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false
      });

      // Create corresponding Patient record
      await Patient.create({
        user: user._id,
        phone: cleanPhone
      });
    }

    // Dispatch verification OTP to mobile phone
    const otpResult = await otpService.sendOtp({
      phone: cleanPhone,
      email: user.email,
      purpose: "PHONE_VERIFICATION"
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      },
      verificationRequired: true,
      phone: user.phone,
      expiresInMinutes: otpResult.expiresInMinutes,
      devOtp: otpResult.devOtp,
      message: `Registration initiated. A 6-digit verification code has been sent to ${user.phone}.`
    };
  }

  /**
   * Verify Mobile OTP and activate user session
   */
  async verifyPhoneOtp({ phone, otp, userAgent, ipAddress }) {
    if (!phone || !otp) {
      const error = new Error("Phone number and OTP code are required");
      error.statusCode = 400;
      throw error;
    }

    const cleanPhone = phone.trim();

    // Verify OTP code
    await otpService.verifyOtp({
      phone: cleanPhone,
      otp,
      purpose: "PHONE_VERIFICATION"
    });

    // Locate user
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      const error = new Error("No registered account found with this phone number");
      error.statusCode = 404;
      throw error;
    }

    // Mark verified
    user.isPhoneVerified = true;
    user.isEmailVerified = true; // Auto-verify email upon mobile verification
    await user.save();

    // Create session and auth tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.createSession({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      userAgent,
      ipAddress
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken
    };
  }

  /**
   * Resend Mobile Verification OTP
   */
  async resendPhoneOtp({ phone }) {
    if (!phone) {
      const error = new Error("Phone number is required");
      error.statusCode = 400;
      throw error;
    }

    const cleanPhone = phone.trim();
    const user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      const error = new Error("No account found with this mobile number");
      error.statusCode = 404;
      throw error;
    }

    if (user.isPhoneVerified) {
      return {
        success: true,
        alreadyVerified: true,
        message: "This mobile number is already verified. You can log in."
      };
    }

    const result = await otpService.sendOtp({
      phone: cleanPhone,
      email: user.email,
      purpose: "PHONE_VERIFICATION"
    });

    return {
      success: true,
      phone: cleanPhone,
      message: `A new verification code was sent to ${cleanPhone}`,
      devOtp: result.devOtp
    };
  }

  /**
   * Login user across all roles
   */
  async loginUser({ email, password, userAgent, ipAddress }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Your account has been deactivated. Please contact support.");
      error.statusCode = 403;
      throw error;
    }

    // Enforce mobile OTP verification for PATIENT users
    if (user.role === "PATIENT" && !user.isPhoneVerified) {
      let otpResult = null;
      if (user.phone) {
        otpResult = await otpService.sendOtp({
          phone: user.phone,
          email: user.email,
          purpose: "PHONE_VERIFICATION"
        }).catch(() => null);
      }

      const error = new Error("Please verify your mobile number to complete registration and access your account.");
      error.statusCode = 403;
      error.requiresPhoneVerification = true;
      error.phone = user.phone;
      error.devOtp = otpResult?.devOtp;
      throw error;
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Refresh token expiry: default 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.createSession({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      userAgent,
      ipAddress
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 400;
      throw error;
    }

    // Verify JWT integrity
    try {
      jwt.verify(refreshToken, env.jwt.refreshSecret);
    } catch (err) {
      const error = new Error("Invalid or expired refresh token");
      error.statusCode = 401;
      throw error;
    }

    const session = await this.validateSession(refreshToken);
    if (!session) {
      const error = new Error("Session has expired or been revoked. Please log in again.");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(session.user);
    if (!user || !user.isActive) {
      const error = new Error("User associated with session is no longer active");
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = this.generateAccessToken(user);

    return {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    };
  }
}

module.exports = new AuthService();
