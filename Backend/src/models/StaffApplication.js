const mongoose = require("mongoose");

const staffApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Applicant email is required"],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    requestedRole: {
      type: String,
      required: [true, "Requested role is required"],
      enum: {
        values: ["DOCTOR", "RECEPTIONIST", "LAB_TECHNICIAN"],
        message: "{VALUE} is not an eligible staff application role. ADMIN cannot be requested."
      }
    },
    qualification: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      trim: true
    },
    specialization: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },
    documents: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],
    status: {
      type: String,
      enum: {
        values: ["PENDING", "APPROVED", "REJECTED"],
        message: "{VALUE} is not a valid application status"
      },
      default: "PENDING",
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const StaffApplication = mongoose.model("StaffApplication", staffApplicationSchema);

module.exports = StaffApplication;
