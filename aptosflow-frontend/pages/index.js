import Head from "next/head";
import Header from "@/components/Header";
import WorkflowCard from "@/components/WorkflowCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchUserWorkflows } from "@/lib/workflowService";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";

const MODULE_ADDRESS = "0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05";

export default function Home() {
  const { account } = useWallet();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch workflows when account changes
  useEffect(() => {
    if (account?.address) {
      loadWorkflows();
    } else {
      setWorkflows([]);
    }
  }, [account?.address]);

  const loadWorkflows = async () => {
    if (!account?.address) return;
    
    setLoading(true);
    try {
      console.log("Loading workflows for account:", account.address);
      console.log("Module address:", MODULE_ADDRESS);
      
      const userWorkflows = await fetchUserWorkflows(account.address);
      console.log("Loaded workflows:", userWorkflows);
      
      setWorkflows(userWorkflows);
      
      if (userWorkflows.length === 0) {
        console.log("No workflows found. You may need to:");
        console.log("1. Create some workflows first using the Create page");
        console.log("2. Make sure your smart contract is deployed");
        console.log("3. Check that the module address is correct");
      }
    } catch (error) {
      console.error("Error loading workflows:", error);
      toast.error("Failed to load workflows", {
        description: "Check console for details. Make sure smart contract is deployed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AptosFlow - Automate Your DeFi</title>
      </Head>
      <main className="flex min-h-screen flex-col text-white">
        <Header />
        <div className="container mx-auto p-4 flex-1 flex flex-col items-center justify-center text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Automate Your DeFi on Aptos
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-lg text-slate-300 max-w-2xl mb-8">
            Create powerful, event-driven automations with our no-code visual builder. Stop watching charts and let AptosFlow execute for you.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Link href="/create">
              <Button size="lg" className="text-lg bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-8 py-4 rounded-lg border-2 border-primary/50 hover:border-primary shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Create Workflow
              </Button>
            </Link>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-24 w-full max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">My Workflows</h2>
              {account && (
                <Button
                  onClick={loadWorkflows}
                  disabled={loading}
                  variant="outline"
                  className="border-white/30 hover:border-white/60 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer disabled:cursor-not-allowed px-4 py-2 rounded-lg"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
            
            {!account ? (
              <div className="text-slate-400 p-8 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                Connect your wallet to view and manage your workflows.
              </div>
            ) : loading ? (
              <div className="text-slate-400 p-8 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading your workflows...
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-slate-400 p-8 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                <div className="space-y-3">
                  <p>No workflows found. Create your first workflow to get started!</p>
                  <Link href="/create">
                    <Button className="bg-primary hover:bg-accent text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Workflow
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <WorkflowCard
                      workflow={workflow}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}