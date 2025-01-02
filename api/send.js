const crypto = require("crypto");
const twilio = require("twilio");
const { MongoClient } = require("mongodb");
const { Keypair } = require('@solana/web3.js'); // Import Solana library

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const encryptionKey = process.env.ENCRYPTION_KEY; // A secure key for encryption
const mongoUri = process.env.MONGODB_URI; // MongoDB connection string

// Create a MongoClient instance
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const encryptData = (data) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(encryptionKey.slice(0, 16), 'hex'));
  let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Generate Solana wallet (public and private key)
const generateRecipientWallet = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const privateKey = keypair.secretKey.toString('hex'); // Store the private key securely

  return { publicKey, privateKey };
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ success: false, message: "Phone number and amount are required." });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const recipientWallet = generateRecipientWallet();

    // Encrypt the wallet and OTP before storing
    const encryptedWallet = encryptData({
      publicKey: recipientWallet.publicKey,
      privateKey: recipientWallet.privateKey,
    });

    const encryptedOtp = encryptData({ otp });

    // Connect to MongoDB
    await client.connect();

    // Get the database and collection
    const db = client.db();
    const recipientsCollection = db.collection('recipients');

    // Insert recipient data into the MongoDB collection
    await recipientsCollection.insertOne({
      phoneNumber,
      otp: encryptedOtp,
      wallet: encryptedWallet,
      amount: parseFloat(amount),
    });

    await twilioClient.messages.create({
      body: `Your OTP is ${otp}. Use it to claim your wallet.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
};