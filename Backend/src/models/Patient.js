const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
        message: "{VALUE} is not a valid gender option"
      }
    },
    bloodGroup: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    allergies: [
      {
        type: String,
        trim: true
      }
    ],
    medicalHistory: [
      {
        type: String,
        trim: true
      }
    ],
    profilePhoto: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
