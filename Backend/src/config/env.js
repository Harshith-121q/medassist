const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medassist",
  jwt: {
    secret: process.env.JWT_SECRET || "medassist_default_secret_key_2026",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "medassist_default_refresh_secret_2026",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

module.exports = env;
