const authService = require("../services/auth.service");
const env = require("../config/env");

const getCookieOptions = (maxAgeMs) => {
  const isProduction = env.nodeEnv === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: maxAgeMs,
    path: "/"
  };
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const registrationData = await authService.registerPatient({
      name,
      email,
      password,
      phone
    });

    return res.status(201).json({
      success: true,
      message: registrationData.message || "Registration initiated. Verification OTP sent to mobile.",
      data: registrationData
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.statusCode
      ? error.message
      : "Failed to register patient";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip || req.connection?.remoteAddress || "";

    const { user, accessToken, refreshToken } = await authService.verifyPhoneOtp({
      phone,
      otp,
      userAgent,
      ipAddress
    });

    // 1 day for access token cookie
    res.cookie("token", accessToken, getCookieOptions(24 * 60 * 60 * 1000));
    // 7 days for refresh token cookie
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return res.status(200).json({
      success: true,
      message: "Mobile number verified and login successful",
      data: {
        user,
        token: accessToken
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Verification failed";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await authService.resendPhoneOtp({ phone });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to resend OTP";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip || req.connection?.remoteAddress || "";

    const { user, accessToken, refreshToken } = await authService.loginUser({
      email,
      password,
      userAgent,
      ipAddress
    });

    // 1 day for access token cookie
    res.cookie("token", accessToken, getCookieOptions(24 * 60 * 60 * 1000));
    // 7 days for refresh token cookie
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token: accessToken
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.statusCode ? error.message : "Authentication failed";

    return res.status(statusCode).json({
      success: false,
      message,
      requiresPhoneVerification: error.requiresPhoneVerification || false,
      phone: error.phone,
      devOtp: error.devOtp
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      await authService.revokeSession(refreshToken);
    }

    // Clear cookies
    const clearOptions = {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "strict" : "lax",
      path: "/"
    };

    res.clearCookie("token", clearOptions);
    res.clearCookie("refreshToken", clearOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        isActive: req.user.isActive,
        isEmailVerified: req.user.isEmailVerified,
        isPhoneVerified: req.user.isPhoneVerified
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile"
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    const { accessToken, user } = await authService.refreshAccessToken(token);

    // Update access token cookie
    res.cookie("token", accessToken, getCookieOptions(24 * 60 * 60 * 1000));

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: accessToken,
        user
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.statusCode ? error.message : "Token refresh failed";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  getMe,
  refreshToken
};
