const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      index: true
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      index: true
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true
    },
    reason: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: [
          "BOOKED",
          "CONFIRMED",
          "CHECKED_IN",
          "IN_QUEUE",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW",
          "RESCHEDULED"
        ],
        message: "{VALUE} is not a valid appointment status"
      },
      default: "BOOKED",
      index: true
    },
    queueNumber: {
      type: Number
    },
    cancellationReason: {
      type: String,
      trim: true
    },
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1, appointmentDate: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
