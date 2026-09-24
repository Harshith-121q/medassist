const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"]
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"]
    }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
      index: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true
    },
    items: {
      type: [invoiceItemSchema],
      default: []
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal cannot be negative"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"]
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"]
    },
    total: {
      type: Number,
      default: 0,
      min: [0, "Total cannot be negative"]
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["PENDING", "PARTIAL", "PAID", "CANCELLED"],
        message: "{VALUE} is not a valid payment status"
      },
      default: "PENDING",
      index: true
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["CASH", "CARD", "UPI", "ONLINE", "OTHER"],
        message: "{VALUE} is not a valid payment method"
      }
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"]
    },
    paidAt: {
      type: Date
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

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
