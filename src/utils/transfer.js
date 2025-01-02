const {
    Connection,
    clusterApiUrl,
    Keypair,
    PublicKey,
    Transaction,
    SystemProgram,
  } = require("@solana/web3.js");
  
  const transferFunds = async (senderSecretKey, recipientPublicKey, amount) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    // Load the sender's wallet from the private key
    const sender = Keypair.fromSecretKey(Buffer.from(senderSecretKey, "base64"));
    const recipient = new PublicKey(recipientPublicKey);
  
    // Create a transaction to transfer funds
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: amount * 1e9, // Convert SOL to lamports
      })
    );
  
    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [sender]);
    await connection.confirmTransaction(signature);
  
    return signature; // Return the transaction signature
  };
  
  module.exports = transferFunds;  