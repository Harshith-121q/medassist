const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient reference is required"],
      index: true
    },
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: [
          "APPOINTMENT",
          "LAB_RESULT",
          "PRESCRIPTION",
          "BILLING",
          "FOLLOW_UP",
          "SYSTEM"
        ],
        message: "{VALUE} is not a valid notification type"
      }
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    relatedResourceType: {
      type: String,
      trim: true
    },
    relatedResourceId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
