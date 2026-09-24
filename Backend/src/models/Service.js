const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    duration: {
      type: Number,
      default: 30,
      min: [1, "Duration must be at least 1 minute"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
