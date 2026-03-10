const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    name: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema({
  customerName: String,
  seatsBooked: Number,
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
  },
  passengers: { type: [passengerSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    default: "Paid",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
