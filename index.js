// Load our secret environment variables
require('dotenv').config();
const express = require('express');
// Import the necessary components from the Aptos SDK
const { Aptos, AptosConfig, Network, Account, U64, Ed25519PrivateKey } = require("@aptos-labs/ts-sdk");

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// --- Aptos Client Configuration ---
const aptosConfig = new AptosConfig({ network: Network.TESTNET, fullnode: "https://aptos-testnet.nodit.io/v1" });
const aptos = new Aptos(aptosConfig);
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;

// Create the Account object from our private key
const privateKey = new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY);
const adminAccount = Account.fromPrivateKey({ privateKey });
console.log(`Admin account address: ${adminAccount.accountAddress}`);

// --- Server Routes ---

app.get('/', (req, res) => {
  res.send('AptosFlow Backend is running!');
});

app.post('/webhook', async (req, res) => {
  console.log("--- Webhook Received! ---");
  console.log(JSON.stringify(req.body, null, 2));
  
  res.status(200).send('Webhook received and processing.');

  try {
    const eventType = req.body.event?.eventType;
    if (eventType !== `${MODULE_ADDRESS}::workflow::CreateWorkflowEvent`) {
        console.log(`Ignoring event of type: ${eventType}`);
        return;
    }

    const workflowId = req.body.event?.messages[0]?.data?.id;

    if (!workflowId) {
        console.error("Could not find workflow ID in webhook payload.");
        return;
    }
    console.log(`Found workflow ID: ${workflowId}`);

    console.log(`Executing workflow for ID: ${workflowId}...`);
    const transaction = await aptos.transaction.build.simple({
        sender: adminAccount.accountAddress,
        data: {
            function: `${MODULE_ADDRESS}::workflow::execute_workflow`,
            functionArguments: [new U64(workflowId)],
        },
    });

    // 🔍 Display the hex payload for debugging
    console.log("\n📦 === TRANSACTION DETAILS ===");
    console.log(`🔗 Function: ${MODULE_ADDRESS}::workflow::execute_workflow`);
    console.log(`📋 Arguments: [${workflowId}]`);
    console.log(`💾 Raw Transaction:`, JSON.stringify(transaction, null, 2));
    
    // Get the hex payload
    const hexPayload = transaction.rawTransaction;
    if (hexPayload) {
        console.log(`🔢 Hex Payload: ${Buffer.from(hexPayload).toString('hex')}`);
    }
    
    console.log("=".repeat(40));

    const committedTxn = await aptos.signAndSubmitTransaction({
        signer: adminAccount,
        transaction: transaction,
    });
    
    console.log(`Transaction submitted with hash: ${committedTxn.hash}`);
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log(`Transaction confirmed for workflow ID: ${workflowId}`);

  } catch (error) {
    console.error("!!! Error executing workflow:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Module Address: ${MODULE_ADDRESS}`);
});