const mongoose = require("mongoose");

const resultItemSchema = new mongoose.Schema(
  {
    parameter: {
      type: String,
      required: [true, "Parameter name is required"],
      trim: true
    },
    value: {
      type: String,
      required: [true, "Result value is required"],
      trim: true
    },
    unit: {
      type: String,
      trim: true
    },
    referenceRange: {
      type: String,
      trim: true
    },
    remarks: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const labResultSchema = new mongoose.Schema(
  {
    labOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabOrder",
      required: [true, "Lab order reference is required"],
      index: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
      index: true
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    results: {
      type: [resultItemSchema],
      default: []
    },
    overallRemarks: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ["DRAFT", "ENTERED", "VERIFIED", "RELEASED"],
        message: "{VALUE} is not a valid lab result status"
      },
      default: "DRAFT",
      index: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verifiedAt: {
      type: Date
    },
    releasedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const LabResult = mongoose.model("LabResult", labResultSchema);

module.exports = LabResult;
