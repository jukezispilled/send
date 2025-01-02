const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true },
  otp: { type: String, required: true },
  wallet: { type: String, required: true }, // Encrypted wallet data
  amount: { type: Number, required: true },
  transferStatus: { type: String, default: "pending" }, // "pending" or "completed"
});

const Recipient = mongoose.model("Recipient", recipientSchema);

module.exports = Recipient;
