const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true
    },
    qualification: {
      type: String,
      trim: true
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, "Experience years cannot be negative"]
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, "Consultation fee cannot be negative"]
    },
    bio: {
      type: String,
      trim: true
    },
    languages: [
      {
        type: String,
        trim: true
      }
    ],
    licenseNumber: {
      type: String,
      trim: true
    },
    profilePhoto: {
      type: String,
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
