import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ 
  network: Network.TESTNET, 
  fullnode: "https://aptos-testnet.nodit.io/v1" 
});
const aptos = new Aptos(aptosConfig);

// Ensure the module address has the correct 0x prefix
const MODULE_ADDRESS_RAW = "d2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05";
const MODULE_ADDRESS = MODULE_ADDRESS_RAW.startsWith("0x") ? MODULE_ADDRESS_RAW : `0x${MODULE_ADDRESS_RAW}`;

/**
 * Fetch all workflows created by a specific user from the blockchain
 * @param {string} userAddress - The user's wallet address
 * @returns {Promise<Array>} Array of user's workflows
 */
export async function fetchUserWorkflows(userAddress) {
  try {
    console.log("=== DEBUGGING WORKFLOW FETCH ===");
    console.log("Fetching real workflows for user:", userAddress);
    console.log("Module address:", MODULE_ADDRESS);
    
    // Convert user address to string format for comparison
    // Handle both string and AccountAddress object types
    let userAddressStr;
    console.log('Raw user address type:', typeof userAddress);
    console.log('Raw user address:', userAddress);
    
    if (typeof userAddress === 'string') {
      userAddressStr = userAddress.startsWith('0x') ? userAddress : `0x${userAddress}`;
    } else if (userAddress.toString) {
      const addrStr = userAddress.toString();
      userAddressStr = addrStr.startsWith('0x') ? addrStr : `0x${addrStr}`;
    } else if (userAddress.data && userAddress.data instanceof Uint8Array) {
      // Convert Uint8Array to hex string
      userAddressStr = '0x' + Array.from(userAddress.data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      throw new Error('Invalid user address format');
    }
    
    // Ensure address is properly formatted (64 characters after 0x)
    if (userAddressStr.length < 66) {
      // Pad with zeros if needed
      const hexPart = userAddressStr.replace('0x', '').padStart(64, '0');
      userAddressStr = '0x' + hexPart;
    }
    
    console.log('User address as string:', userAddressStr);
    
    // Method 1: Try the most recent Aptos API
    const indexerUrl = "https://api.testnet.aptoslabs.com/v1";
    
    // First, try to get workflows created by the user's wallet
    console.log("🔍 Searching for workflows created by YOUR wallet:", userAddressStr);
    let allWorkflows = [];
    
    try {
      const userTransactionsUrl = `${indexerUrl}/accounts/${userAddressStr}/transactions?limit=100`;
      console.log("Fetching user transactions from URL:", userTransactionsUrl);
      
      const userTransactionsResponse = await fetch(userTransactionsUrl);
      
      if (userTransactionsResponse.ok) {
        const userTransactions = await userTransactionsResponse.json();
        console.log("✅ User transactions found:", Array.isArray(userTransactions) ? userTransactions.length : "Not an array");
        
        if (Array.isArray(userTransactions)) {
          for (let i = 0; i < userTransactions.length; i++) {
            const tx = userTransactions[i];
            console.log(`\n--- USER Transaction ${i + 1} ---`);
            console.log("TX Hash:", tx.hash);
            console.log("TX Type:", tx.type);
            console.log("TX Success:", tx.success);
            
            if (tx.events) {
              for (let j = 0; j < tx.events.length; j++) {
                const event = tx.events[j];
                
                // Check if this is a workflow creation event
                if (event.type === `${MODULE_ADDRESS}::workflow::CreateWorkflowEvent`) {
                  console.log("  🎯 Found YOUR CreateWorkflowEvent!");
                  console.log("  - Event data:", event.data);
                  
                  const workflow = {
                    id: parseInt(event.data.id),
                    trigger: event.data.trigger,
                    action: event.data.action,
                    owner: event.data.owner,
                    status: 'active',
                    timestamp: new Date(parseInt(tx.timestamp) / 1000),
                    txHash: tx.hash
                  };
                  
                  console.log("  📝 Adding YOUR workflow:", workflow);
                  allWorkflows.push(workflow);
                }
              }
            }
          }
        }
      } else {
        console.log("❌ Failed to fetch user transactions:", userTransactionsResponse.status);
      }
    } catch (error) {
      console.log("❌ Error fetching user transactions:", error);
    }
    
    // Then, also get workflows from the module address (for testing/demo purposes)
    console.log("\n🔍 Also searching module address for demo workflows...");
    const transactionsUrl = `${indexerUrl}/accounts/${MODULE_ADDRESS}/transactions?limit=100`;
    
    console.log("Fetching from URL:", transactionsUrl);
    
    const transactionsResponse = await fetch(transactionsUrl);
    
    console.log("Response status:", transactionsResponse.status);
    console.log("Response ok:", transactionsResponse.ok);
    
    if (!transactionsResponse.ok) {
      const errorText = await transactionsResponse.text();
      console.error("API Error:", errorText);
      throw new Error(`HTTP error! status: ${transactionsResponse.status}, body: ${errorText}`);
    }
    
    const transactions = await transactionsResponse.json();
    console.log("Raw transactions response:", transactions);
    console.log("Number of transactions found:", Array.isArray(transactions) ? transactions.length : "Not an array");
    
    // Parse transactions to find workflow creation events
    if (Array.isArray(transactions)) {
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        console.log(`\n--- Transaction ${i + 1} ---`);
        console.log("TX Hash:", tx.hash);
        console.log("TX Type:", tx.type);
        console.log("TX Success:", tx.success);
        console.log("TX Events:", tx.events ? tx.events.length : 0);
        
        if (tx.events) {
          for (let j = 0; j < tx.events.length; j++) {
            const event = tx.events[j];
            console.log(`  Event ${j + 1}:`);
            console.log("  - Type:", event.type);
            console.log("  - Data:", event.data);
            
            // Check if this is a workflow creation event
            if (event.type === `${MODULE_ADDRESS}::workflow::CreateWorkflowEvent`) {
              console.log("  ✅ Found CreateWorkflowEvent!");
              console.log("  - Event owner:", event.data.owner);
              console.log("  - User address:", userAddressStr);
              const isMatch = event.data.owner === userAddressStr;
              console.log("  - Match:", isMatch);
              
              // TEMPORARY: Show all workflows for testing (remove this condition later)
              const showAllWorkflows = true;
              const isTestWorkflow = event.data.trigger === "Testnet Success" && event.data.action === "This should trigger the webhook";
              
              if ((isMatch || showAllWorkflows) && !isTestWorkflow) {
                if (showAllWorkflows && !isMatch) {
                  console.log("  🧪 SHOWING ALL WORKFLOWS (TEST MODE) - This workflow belongs to another user");
                } else {
                  console.log("  🎯 WORKFLOW BELONGS TO USER! Adding to results...");
                }
                
                const workflow = {
                  id: parseInt(event.data.id),
                  trigger: event.data.trigger,
                  action: event.data.action,
                  owner: event.data.owner,
                  status: 'active',
                  timestamp: new Date(parseInt(tx.timestamp) / 1000),
                  txHash: tx.hash
                };
                
                console.log("  ✅ Added workflow:", workflow);
                allWorkflows.push(workflow);
              }
            }
          }
        }
      }
    }
    
    console.log("\n=== FINAL RESULTS ===");
    console.log("YOUR workflows found:", allWorkflows.filter(w => w.owner === userAddressStr).length);
    console.log("Demo workflows found:", allWorkflows.filter(w => w.owner !== userAddressStr).length);
    console.log("Total workflows:", allWorkflows.length);
    
    return allWorkflows.sort((a, b) => b.id - a.id);
    
  } catch (error) {
    console.error("=== ERROR IN FETCH ===");
    console.error("Error fetching user workflows:", error);
    console.error("Error stack:", error.stack);
    
    // Fallback: Return empty array and show helpful message
    console.log("Returning empty array due to error");
    return [];
  }
}

/**
 * Fetch all workflows from the blockchain (for admin view)
 * @returns {Promise<Array>} Array of all workflows
 */
export async function fetchAllWorkflows() {
  try {
    console.log("Fetching all workflows from blockchain...");
    
    // Use the Aptos Indexer API directly
    const indexerUrl = "https://api.testnet.aptoslabs.com/v1";
    
    const transactionsResponse = await fetch(
      `${indexerUrl}/accounts/${MODULE_ADDRESS}/transactions?limit=100`
    );
    
    if (!transactionsResponse.ok) {
      throw new Error(`HTTP error! status: ${transactionsResponse.status}`);
    }
    
    const transactions = await transactionsResponse.json();
    console.log("Fetched all transactions:", transactions);
    
    const allWorkflows = [];
    
    // Parse transactions to find all workflow creation events
    for (const tx of transactions) {
      if (tx.events) {
        for (const event of tx.events) {
          if (event.type === `${MODULE_ADDRESS}::workflow::CreateWorkflowEvent`) {
            allWorkflows.push({
              id: parseInt(event.data.id),
              owner: event.data.owner,
              trigger: event.data.trigger,
              action: event.data.action,
              version: tx.version,
              timestamp: new Date(parseInt(tx.timestamp) / 1000),
              transactionHash: tx.hash,
            });
          }
        }
      }
    }
    
    console.log("Found all workflows:", allWorkflows);
    return allWorkflows.sort((a, b) => b.id - a.id);
    
  } catch (error) {
    console.error("Error fetching all workflows:", error);
    return [];
  }
}

/**
 * Fetch execution events for a specific workflow
 * @param {number} workflowId - The workflow ID
 * @returns {Promise<Array>} Array of execution events
 */
export async function fetchWorkflowExecutions(workflowId) {
  try {
    console.log("Fetching real executions for workflow:", workflowId);
    
    // Use the Aptos Indexer API to get execution events
    const indexerUrl = "https://api.testnet.aptoslabs.com/v1";
    
    const transactionsResponse = await fetch(
      `${indexerUrl}/accounts/${MODULE_ADDRESS}/transactions?limit=100`
    );
    
    if (!transactionsResponse.ok) {
      throw new Error(`HTTP error! status: ${transactionsResponse.status}`);
    }
    
    const transactions = await transactionsResponse.json();
    console.log("Fetched transactions for executions:", transactions);
    
    const workflowExecutions = [];
    
    // Parse transactions to find workflow execution events
    for (const tx of transactions) {
      if (tx.events) {
        for (const event of tx.events) {
          if (
            event.type === `${MODULE_ADDRESS}::workflow::ExecuteWorkflowEvent` &&
            parseInt(event.data.id) === workflowId
          ) {
            workflowExecutions.push({
              id: parseInt(event.data.id),
              executor: event.data.executor,
              status: event.data.status,
              timestamp: new Date(parseInt(tx.timestamp) / 1000),
              transactionHash: tx.hash,
            });
          }
        }
      }
    }
    
    console.log("Found execution events:", workflowExecutions);
    return workflowExecutions.sort((a, b) => b.timestamp - a.timestamp);
    
  } catch (error) {
    console.error("Error fetching workflow executions:", error);
    return [];
  }
}

/**
 * Format address for display
 * @param {string|object} address - Full address (string or address object)
 * @returns {string} Shortened address
 */
export function formatAddress(address) {
  if (!address) return "";
  
  // Handle both string addresses and address objects
  const addressString = typeof address === 'string' ? address : address.toString();
  
  if (!addressString || addressString.length < 10) return addressString || "";
  
  return `${addressString.slice(0, 6)}...${addressString.slice(-4)}`;
}

/**
 * Format timestamp for display
 * @param {Date|string|number} timestamp - Date object, string, or timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp) {
  // Handle undefined or null
  if (!timestamp) {
    return "Unknown date";
  }
  
  // If it's already a Date object
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString();
  }
  
  // If it's a string or number, try to convert to Date
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid date";
  }
}