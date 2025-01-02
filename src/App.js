import React, { useState } from "react";

const App = () => {
  const [step, setStep] = useState(1); // Steps: 1 - Input, 2 - OTP
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [wallet, setWallet] = useState(null);

  const handleSendCrypto = async () => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setStep(2); // Move to OTP verification
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error sending crypto:", error);
      setMessage("An error occurred.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setWallet(data.wallet);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {step === 1 && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Send Crypto</h2>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            onClick={handleSendCrypto}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Send
          </button>
          {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Verify
          </button>
          {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        </div>
      )}

      {wallet && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Wallet Details</h2>
          <p>
            <strong>Public Key:</strong> {wallet.publicKey}
          </p>
          <p>
            <strong>Amount:</strong> {amount} SOL
          </p>
        </div>
      )}
    </div>
  );
};

export default App;