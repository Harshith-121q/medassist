const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: {
        values: [
          "CREATE",
          "READ",
          "UPDATE",
          "DELETE",
          "LOGIN",
          "LOGOUT",
          "APPROVE",
          "REJECT",
          "VERIFY",
          "RELEASE"
        ],
        message: "{VALUE} is not a valid audit action"
      }
    },
    resourceType: {
      type: String,
      trim: true
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    description: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    // Immutable audit record: createdAt only, no updatedAt
    timestamps: { createdAt: true, updatedAt: false }
  }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
