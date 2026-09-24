const mongoose = require("mongoose");

const medicineItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true
    },
    dosage: {
      type: String,
      trim: true
    },
    frequency: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      trim: true
    },
    route: {
      type: String,
      trim: true
    },
    instructions: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
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
    medicines: {
      type: [medicineItemSchema],
      default: []
    },
    generalInstructions: {
      type: String,
      trim: true
    },
    followUpDate: {
      type: Date
    },
    // AI Explanation fields
    aiExplanation: {
      type: String,
      trim: true
    },
    aiExplanationGeneratedAt: {
      type: Date
    },
    aiExplanationStatus: {
      type: String,
      enum: {
        values: ["NOT_GENERATED", "GENERATED", "REVIEWED"],
        message: "{VALUE} is not a valid AI explanation status"
      },
      default: "NOT_GENERATED"
    }
  },
  {
    timestamps: true
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
