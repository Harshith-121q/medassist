const mongoose = require("mongoose");

const medicalNoteSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
      index: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
      index: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment reference is required"],
      index: true
    },
    chiefComplaint: {
      type: String,
      trim: true
    },
    symptoms: [
      {
        type: String,
        trim: true
      }
    ],
    medicalHistory: {
      type: String,
      trim: true
    },
    examination: {
      type: String,
      trim: true
    },
    diagnosis: {
      type: String,
      trim: true
    },
    treatment: {
      type: String,
      trim: true
    },
    followUpInstructions: {
      type: String,
      trim: true
    },
    // AI Assistant fields
    aiSummary: {
      type: String,
      trim: true
    },
    aiSummaryStatus: {
      type: String,
      enum: {
        values: ["NOT_GENERATED", "GENERATED", "ACCEPTED"],
        message: "{VALUE} is not a valid AI summary status"
      },
      default: "NOT_GENERATED"
    },
    aiSummaryGeneratedAt: {
      type: Date
    },
    aiSummaryReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const MedicalNote = mongoose.model("MedicalNote", medicalNoteSchema);

module.exports = MedicalNote;
