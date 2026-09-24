const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Trust reverse proxy (Render, Heroku, etc.)
app.set("trust proxy", 1);

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://medassist-r44itnetv-harshithkumarlingampally35-1947s-projects.vercel.app"
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",").forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      try {
        const parsed = new URL(origin);
        // Allow listed origins or any Vercel deployment preview domain
        if (
          allowedOrigins.includes(origin) ||
          parsed.hostname.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
      } catch (err) {
        // invalid URL
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(cookieParser());

// Root ping
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedAssist backend is active and operational",
    healthCheck: "/api/health"
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Staff applications endpoint
app.post("/api/staff-applications", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Staff application received successfully",
    data: req.body
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedAssist backend is running"
  });
});

module.exports = app;