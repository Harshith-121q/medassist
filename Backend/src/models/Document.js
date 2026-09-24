const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      index: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader reference is required"],
      index: true
    },
    documentType: {
      type: String,
      required: [true, "Document type is required"],
      enum: {
        values: [
          "MEDICAL_REPORT",
          "LAB_REPORT",
          "PRESCRIPTION",
          "INVOICE",
          "ID_DOCUMENT",
          "OTHER"
        ],
        message: "{VALUE} is not a valid document type"
      }
    },
    fileName: {
      type: String,
      trim: true
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      trim: true
    },
    mimeType: {
      type: String,
      trim: true
    },
    fileSize: {
      type: Number,
      min: [0, "File size cannot be negative"]
    },
    description: {
      type: String,
      trim: true
    },
    visibility: {
      type: String,
      enum: {
        values: ["PRIVATE", "PATIENT", "DOCTOR", "STAFF"],
        message: "{VALUE} is not a valid visibility option"
      },
      default: "PRIVATE"
    }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
