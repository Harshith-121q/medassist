const mongoose = require("mongoose");

const labTestItemSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: [true, "Test name is required"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const labOrderSchema = new mongoose.Schema(
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
      index: true
    },
    tests: {
      type: [labTestItemSchema],
      default: []
    },
    priority: {
      type: String,
      enum: {
        values: ["NORMAL", "URGENT"],
        message: "{VALUE} is not a valid priority"
      },
      default: "NORMAL"
    },
    status: {
      type: String,
      enum: {
        values: [
          "ORDERED",
          "SAMPLE_COLLECTED",
          "PROCESSING",
          "RESULT_ENTERED",
          "VERIFIED",
          "RELEASED",
          "CANCELLED"
        ],
        message: "{VALUE} is not a valid lab order status"
      },
      default: "ORDERED",
      index: true
    },
    sampleCollectedAt: {
      type: Date
    },
    processingStartedAt: {
      type: Date
    },
    resultEnteredAt: {
      type: Date
    },
    verifiedAt: {
      type: Date
    },
    releasedAt: {
      type: Date
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const LabOrder = mongoose.model("LabOrder", labOrderSchema);

module.exports = LabOrder;
