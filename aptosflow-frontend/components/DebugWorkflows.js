import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RefreshCw, Bug, ExternalLink } from "lucide-react";

const MODULE_ADDRESS = "0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05";

const DebugWorkflows = ({ userAddress }) => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDebugCheck = async () => {
    setLoading(true);
    const info = {
      timestamp: new Date().toISOString(),
      userAddress,
      moduleAddress: MODULE_ADDRESS,
      apiTests: {},
      errors: []
    };

    try {
      // Test 1: Check if module account exists
      console.log("🔍 Testing module account existence...");
      const accountUrl = `https://api.testnet.aptoslabs.com/v1/accounts/${MODULE_ADDRESS}`;
      const accountResponse = await fetch(accountUrl);
      info.apiTests.accountExists = {
        status: accountResponse.status,
        ok: accountResponse.ok,
        url: accountUrl
      };

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        info.apiTests.accountData = accountData;
      } else {
        const errorText = await accountResponse.text();
        info.errors.push(`Account check failed: ${errorText}`);
      }

      // Test 2: Check transactions
      console.log("🔍 Testing transactions endpoint...");
      const txUrl = `https://api.testnet.aptoslabs.com/v1/accounts/${MODULE_ADDRESS}/transactions?limit=10`;
      const txResponse = await fetch(txUrl);
      info.apiTests.transactions = {
        status: txResponse.status,
        ok: txResponse.ok,
        url: txUrl
      };

      if (txResponse.ok) {
        const txData = await txResponse.json();
        info.apiTests.transactionCount = Array.isArray(txData) ? txData.length : 0;
        info.apiTests.sampleTransactions = Array.isArray(txData) ? txData.slice(0, 3) : [];
        
        // Look for workflow events
        let workflowEvents = 0;
        let userWorkflowEvents = 0;
        
        if (Array.isArray(txData)) {
          for (const tx of txData) {
            if (tx.events) {
              for (const event of tx.events) {
                if (event.type.includes("CreateWorkflowEvent")) {
                  workflowEvents++;
                  if (event.data.owner === userAddress) {
                    userWorkflowEvents++;
                  }
                }
              }
            }
          }
        }
        
        info.apiTests.workflowEvents = workflowEvents;
        info.apiTests.userWorkflowEvents = userWorkflowEvents;
      } else {
        const errorText = await txResponse.text();
        info.errors.push(`Transactions check failed: ${errorText}`);
      }

      // Test 3: Check module resources
      console.log("🔍 Testing module resources...");
      const resourceUrl = `https://api.testnet.aptoslabs.com/v1/accounts/${MODULE_ADDRESS}/resources`;
      const resourceResponse = await fetch(resourceUrl);
      info.apiTests.resources = {
        status: resourceResponse.status,
        ok: resourceResponse.ok,
        url: resourceUrl
      };

      if (resourceResponse.ok) {
        const resourceData = await resourceResponse.json();
        info.apiTests.resourceCount = Array.isArray(resourceData) ? resourceData.length : 0;
        info.apiTests.workflowStoreExists = resourceData.some(r => 
          r.type.includes("WorkflowStore")
        );
      }

    } catch (error) {
      info.errors.push(`Debug check failed: ${error.message}`);
      console.error("Debug check error:", error);
    }

    setDebugInfo(info);
    setLoading(false);
  };

  const openExplorer = () => {
    window.open(`https://explorer.aptoslabs.com/account/${MODULE_ADDRESS}?network=testnet`, "_blank");
  };

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bug className="h-5 w-5" />
          Debug Workflow Issues
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={runDebugCheck}
            disabled={loading}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Debug Check
          </Button>
          <Button
            onClick={openExplorer}
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Module on Explorer
          </Button>
        </div>

        {debugInfo && (
          <div className="space-y-3 text-sm">
            <div className="bg-black/30 p-3 rounded border border-white/10">
              <h4 className="font-semibold text-primary mb-2">Debug Results</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400">User Address:</span>
                  <span className="ml-2 font-mono text-xs">{debugInfo.userAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400">Module Address:</span>
                  <span className="ml-2 font-mono text-xs">{debugInfo.moduleAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400">Account Exists:</span>
                  <span className={`ml-2 ${debugInfo.apiTests.accountExists?.ok ? 'text-green-400' : 'text-red-400'}`}>
                    {debugInfo.apiTests.accountExists?.ok ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Transactions Found:</span>
                  <span className="ml-2 text-white">{debugInfo.apiTests.transactionCount || 0}</span>
                </div>
                <div>
                  <span className="text-slate-400">Workflow Events:</span>
                  <span className="ml-2 text-white">{debugInfo.apiTests.workflowEvents || 0}</span>
                </div>
                <div>
                  <span className="text-slate-400">Your Workflow Events:</span>
                  <span className={`ml-2 ${(debugInfo.apiTests.userWorkflowEvents || 0) > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {debugInfo.apiTests.userWorkflowEvents || 0}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">WorkflowStore Resource:</span>
                  <span className={`ml-2 ${debugInfo.apiTests.workflowStoreExists ? 'text-green-400' : 'text-red-400'}`}>
                    {debugInfo.apiTests.workflowStoreExists ? '✅ Found' : '❌ Missing'}
                  </span>
                </div>
              </div>

              {debugInfo.errors.length > 0 && (
                <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
                  <h5 className="text-red-400 font-semibold mb-1">Errors:</h5>
                  {debugInfo.errors.map((error, i) => (
                    <div key={i} className="text-red-300 text-xs">{error}</div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-slate-500">
                Check browser console for detailed logs
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugWorkflows;