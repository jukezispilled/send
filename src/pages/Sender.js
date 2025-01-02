import React, { useState } from "react";
import axios from "axios";

const Sender = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const sendCrypto = async () => {
    setStatus("Processing...");

    try {
      // Mock API call to backend
      const response = await axios.post("http://localhost:4000/send", {
        phoneNumber,
        amount,
      });

      if (response.data.success) {
        setStatus("Crypto sent successfully!");
      } else {
        setStatus("Failed to send crypto.");
      }
    } catch (error) {
      console.error("Error sending crypto:", error);
      setStatus("Error occurred while sending.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Send Crypto</h1>
        <label className="block mb-2">
          <span className="text-gray-700">Phone Number:</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter recipient's phone number"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Amount (SOL):</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in SOL"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </label>
        <button
          onClick={sendCrypto}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Send
        </button>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default Sender;