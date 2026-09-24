const mongoose = require("mongoose");

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
      index: true
    },
    dayOfWeek: {
      type: String,
      required: [true, "Day of week is required"],
      enum: {
        values: [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY"
        ],
        message: "{VALUE} is not a valid day of the week"
      }
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
    breakStartTime: {
      type: String,
      trim: true
    },
    breakEndTime: {
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

doctorScheduleSchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true });

const DoctorSchedule = mongoose.model("DoctorSchedule", doctorScheduleSchema);

module.exports = DoctorSchedule;
