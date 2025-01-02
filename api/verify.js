const mongoose = require("mongoose");
const transferFunds = require("../utils/transfer");
const Recipient = require("../models/Recipient");
const crypto = require("crypto");

const encryptionKey = process.env.ENCRYPTION_KEY;

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(encryptionKey.slice(0, 16), 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return JSON.parse(decrypted);
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required." });
  }

  try {
    const recipient = await Recipient.findOne({ phoneNumber });
    if (!recipient) {
      return res.status(404).json({ success: false, message: "Recipient not found." });
    }

    const decryptedOtp = decryptData(recipient.otp);
    if (decryptedOtp.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }

    const decryptedWallet = decryptData(recipient.wallet);
    const { wallet, amount } = decryptedWallet;

    const senderPrivateKey = process.env.SENDER_PRIVATE_KEY;
    const txSignature = await transferFunds(senderPrivateKey, wallet.publicKey, amount);

    recipient.transferStatus = "completed";
    await recipient.save();

    return res.status(200).json({
      success: true,
      message: "Funds transferred successfully!",
      wallet: wallet.publicKey,
      transactionSignature: txSignature,
    });
  } catch (error) {
    console.error("Error verifying OTP or transferring funds:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};