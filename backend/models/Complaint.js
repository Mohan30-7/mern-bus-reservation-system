const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  username: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String, default: "" },
  repliedByAdmin: { type: String, default: "" },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", complaintSchema);
