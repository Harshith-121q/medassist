const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Read authentication token from httpOnly cookie first
    if (req.cookies && (req.cookies.token || req.cookies.accessToken)) {
      token = req.cookies.token || req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      // Fallback for API clients passing Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in."
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt.secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token"
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists"
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account has been deactivated"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};

module.exports = { authenticate };
