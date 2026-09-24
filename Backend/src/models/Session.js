const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true
    },
    token: {
      type: String,
      required: [true, "Session token is required"],
      index: true
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
      index: true
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    userAgent: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

sessionSchema.index({ user: 1, isRevoked: 1 });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
