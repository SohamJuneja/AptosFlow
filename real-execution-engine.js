require('dotenv').config();
const express = require('express');
const { Aptos, AptosConfig, Network, Account, U64, Ed25519PrivateKey } = require("@aptos-labs/ts-sdk");

// Health check HTTP server for cloud deployment
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    status: 'running',
    service: 'AptosFlow Autonomous Execution Engine',
    executor: executorAccount.accountAddress.toString(),
    message: 'Backend is monitoring blockchain for magic trigger transactions'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🌐 Health check server running on port ${PORT}`);
});

// Aptos setup with Nodit priority
let aptosConfig;
if (process.env.HTTPS_URL && process.env.HTTPS_URL.includes('aptos')) {
  console.log(`🌐 Attempting Nodit private RPC...`);
  try {
    aptosConfig = new AptosConfig({ 
      fullnode: `${process.env.HTTPS_URL}/v1`,
      network: Network.TESTNET 
    });
  } catch (error) {
    console.log(`⚠️  Nodit RPC failed, using public RPC`);
    aptosConfig = new AptosConfig({ network: Network.TESTNET });
  }
} else {
  console.log(`🌐 Using public Aptos RPC (Nodit URL not configured)`);
  aptosConfig = new AptosConfig({ network: Network.TESTNET });
}

const aptos = new Aptos(aptosConfig);
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;

// Executor account
const privateKey = new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY);
const executorAccount = Account.fromPrivateKey({ privateKey });

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🚀 AptosFlow REAL Autonomous Execution Engine 🚀         ║
║                                                              ║
║              100% Real Blockchain Transactions               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📍 Executor: ${executorAccount.accountAddress}
🎯 Magic Trigger: 0.012345 APT (1234500 octas)
⚡ Response: 0.001 APT (100000 octas)
🔍 Polling blockchain every 10 seconds...

`);

const MAGIC_TRIGGER_AMOUNT = 1234500; // 0.012345 APT (1 APT = 100,000,000 octas)
const EXECUTION_AMOUNT = 100000; // 0.001 APT
const MONITORED_ADDRESSES = [
  "0x32a7fe0f2bca2560ae46b21cc956a93c5ff0494206569c6e23ea652f45c2b512", // Your wallet
  // Add more addresses to monitor here
];
let processedTransactions = new Set();
let lastCheckedVersion = 0;

async function checkForMagicTriggers() {
  try {
    // Check transactions from all monitored addresses
    for (const address of MONITORED_ADDRESSES) {
      const transactions = await aptos.getAccountTransactions({
        accountAddress: address,
        options: { limit: 25 }
      });

      for (const txn of transactions) {
        // Skip if already processed
        if (processedTransactions.has(txn.hash)) continue;
        
        // Skip if not a user transaction
        if (txn.type !== "user_transaction") continue;
        
        // Check if it's a transfer
        const payload = txn.payload;
        if (payload?.function === "0x1::aptos_account::transfer" || 
            payload?.function === "0x1::aptos_account::transfer_coins") {
          
          const amount = parseInt(payload.arguments[1]);
          
          // Check for magic trigger amount
          if (amount === MAGIC_TRIGGER_AMOUNT) {
            const sender = txn.sender;
            
            // Mark as processed
            processedTransactions.add(txn.hash);
            
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║            🔥🔥🔥 MAGIC TRIGGER DETECTED! 🔥🔥🔥               ║
╚══════════════════════════════════════════════════════════════╝

📝 Transaction Details:
   • Hash: ${txn.hash}
   • Sender: ${sender}
   • Amount: ${amount} octas (0.012345 APT)
   • Block: ${txn.version}
   • Timestamp: ${new Date().toLocaleString()}

🔗 Explorer: https://explorer.aptoslabs.com/txn/${txn.hash}?network=testnet

⚡ INITIATING AUTONOMOUS EXECUTION...
`);

            // Execute autonomous workflow
            await executeWorkflow(sender, txn.hash);
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error checking transactions:`, error.message);
  }
}

async function executeWorkflow(userAddress, triggerTxHash) {
  try {
    console.log(`🎯 Executing workflow for user: ${userAddress}`);
    console.log(`💸 Preparing to send ${EXECUTION_AMOUNT} octas (0.001 APT) back...`);
    
    // Build a direct transfer transaction (since smart contract doesn't support token transfer yet)
    const transaction = await aptos.transaction.build.simple({
      sender: executorAccount.accountAddress,
      data: {
        function: "0x1::aptos_account::transfer",
        functionArguments: [userAddress, EXECUTION_AMOUNT],
      },
    });

    console.log(`📝 Submitting autonomous execution transaction...`);
    
    // Sign and submit
    const committedTxn = await aptos.signAndSubmitTransaction({
      signer: executorAccount,
      transaction: transaction,
    });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║           🎉🎉🎉 EXECUTION SUCCESSFUL! 🎉🎉🎉                  ║
╚══════════════════════════════════════════════════════════════╝

📖 Response Transaction:
   • Hash: ${committedTxn.hash}
   • Recipient: ${userAddress}
   • Amount: ${EXECUTION_AMOUNT} octas (0.001 APT)

🔗 Explorer: https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=testnet

⏳ Waiting for blockchain confirmation...
`);

    // Wait for confirmation
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    console.log(`
✅ TRANSACTION CONFIRMED ON BLOCKCHAIN!

🤖 Workflow executed AUTONOMOUSLY - no human intervention!
💰 Sent 0.001 APT to ${userAddress}
⏰ Completed at: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   1. Trigger TX: ${triggerTxHash}
      └─> User sent 0.012345 APT
   
   2. Response TX: ${committedTxn.hash}
      └─> System sent 0.001 APT back (AUTONOMOUS!)

Both transactions are verified on Aptos Explorer! ✨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`);

  } catch (error) {
    console.error(`
❌ Execution failed: ${error.message}
Stack: ${error.stack}
`);
  }
}

// Main polling loop
async function startPolling() {
  console.log(`🔄 Starting blockchain monitoring...`);
  console.log(`⏰ Checking every 10 seconds for magic triggers\n`);
  
  // Check balance first
  try {
    const balance = await aptos.getAccountAPTAmount({
      accountAddress: executorAccount.accountAddress,
    });
    console.log(`💰 Executor balance: ${balance / 100000000} APT`);
    
    if (balance < 1000000) {
      console.log(`⚠️  WARNING: Low balance! Add more APT for executions.\n`);
    } else {
      console.log(`✅ Sufficient balance for autonomous execution\n`);
    }
  } catch (error) {
    console.log(`⚠️  Could not check balance: ${error.message}\n`);
  }
  
  console.log(`🎯 Monitoring for transactions with amount = 0.012345 APT`);
  console.log(`💡 Send 0.012345 APT to ANY address to trigger execution!\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Poll every 10 seconds
  setInterval(async () => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 🔍 Scanning blockchain for magic triggers...`);
    await checkForMagicTriggers();
  }, 10000);
  
  // Initial check
  await checkForMagicTriggers();
}

// Start the engine!
startPolling();

// Keep alive
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down execution engine...');
  console.log('✅ Stopped monitoring blockchain');
  process.exit(0);
});
