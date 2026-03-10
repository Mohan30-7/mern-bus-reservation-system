const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false },
);

const busSchema = new mongoose.Schema({
  sourceCity: { type: String, default: "" },
  destinationCity: { type: String, default: "" },
  route: { type: String, default: "" }, // optional, can be derived from source/destination
  journeyDate: { type: Date },
  departureTime: { type: String, default: "" },
  driverName: { type: String, default: "" },

  price: { type: Number, default: 0 },
  totalSeats: { type: Number, default: 40 },
  availableSeats: { type: Number, default: 40 },
  busNumber: { type: Number, default: 0 },

  // image can be an absolute URL (uploads) or a public path like /b1.jpg
  image: { type: String, default: "" },
  imageUrl: { type: String, default: "" }, // kept for backward compatibility

  amenities: { type: [String], default: [] },
  seats: { type: [seatSchema], default: [] },
});

module.exports = mongoose.model("Bus", busSchema);
