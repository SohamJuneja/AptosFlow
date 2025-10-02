import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast } from "sonner";
import { motion } from "framer-motion";

const aptosConfig = new AptosConfig({ network: Network.TESTNET, fullnode: "https://aptos-testnet.nodit.io/v1" });
const aptos = new Aptos(aptosConfig);
const MODULE_ADDRESS = "0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05";

const stringToHex = (str) => '0x' + Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

export default function CreateWorkflow() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [trigger, setTrigger] = useState("");
  const [action, setAction] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { trigger: queryTrigger, action: queryAction } = router.query;
      if (queryTrigger) setTrigger(queryTrigger);
      if (queryAction) setAction(queryAction);
    }
  }, [router.isReady, router.query]);

  const handleCreateWorkflow = async () => {
    if (!account) { toast.error("Please connect your wallet first!"); return; }
    if (!trigger || !action) { toast.error("Please select a trigger and an action."); return; }
    setIsSubmitting(true);
    toast.loading("Submitting transaction...");
    let actionPayloadObject = {};
    const actionDescription = `Action: ${action} ${amount}`;
    if (action === "tapp-swap") { actionPayloadObject = { type: "entry_function_payload", function: "0x123...::tapp_swap::swap_script", type_arguments: ["0x1::aptos_coin::AptosCoin", "0x456...::usdc::USDC"], arguments: [amount], }; }
    else if (action === "hyperion-lp") { actionPayloadObject = { type: "entry_function_payload", function: "0x789...::hyperion::rebalance", arguments: [], }; }
    else { actionPayloadObject = { type: "generic_action", details: actionDescription, }; }
    const payloadString = JSON.stringify(actionPayloadObject);
    const hexPayload = stringToHex(payloadString);
    const transaction = { sender: account.address, data: { function: `${MODULE_ADDRESS}::workflow::create_workflow`, functionArguments: [`Trigger: ${trigger}`, actionDescription, hexPayload,], }, };
    try {
      const response = await signAndSubmitTransaction(transaction);
      toast.dismiss();
      toast.success("Workflow submitted successfully!", { 
        description: `Transaction hash: ${response.hash.slice(0, 10)}...`, 
        action: { 
          label: "View on Explorer", 
          onClick: () => window.open(`https://explorer.aptoslabs.com/txn/${response.hash}?network=testnet`, "_blank"), 
        }, 
      });
      
      // Navigate back to home page after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      toast.dismiss();
      toast.error("Transaction failed.", { description: error.message || "Please try again.", });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head><title>Create Workflow - AptosFlow</title></Head>
      <main className="flex min-h-screen flex-col text-white">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-bold mb-8">Create a New Workflow</motion.h1>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex w-full max-w-4xl items-center justify-center gap-8">
            <Card className="w-1/2 bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-center text-2xl text-slate-200">When this happens...</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <label className="text-sm font-medium text-slate-400">Trigger</label>
                <Select value={trigger} onValueChange={setTrigger}><SelectTrigger className="w-full bg-black/30 border-white/20 cursor-pointer hover:bg-black/40 transition-all"><SelectValue placeholder="Select a trigger" /></SelectTrigger><SelectContent className="bg-background/80 backdrop-blur-lg border-white/10 text-white"><SelectItem value="receive-apt" className="cursor-pointer hover:bg-white/10">Receive APT</SelectItem><SelectItem value="receive-usdc" className="cursor-pointer hover:bg-white/10">Receive USDC</SelectItem></SelectContent></Select>
              </CardContent>
            </Card>
            <ArrowRight className="h-12 w-12 text-slate-500" />
            <Card className="w-1/2 bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-center text-2xl text-slate-200">Do this...</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <label className="text-sm font-medium text-slate-400">Action</label>
                <Select value={action} onValueChange={setAction}><SelectTrigger className="w-full bg-black/30 border-white/20 cursor-pointer hover:bg-black/40 transition-all"><SelectValue placeholder="Select an action" /></SelectTrigger><SelectContent className="bg-background/80 backdrop-blur-lg border-white/10 text-white"><SelectItem value="tapp-swap" className="cursor-pointer hover:bg-white/10">Swap Token (Tapp.Exchange)</SelectItem><SelectItem value="hyperion-lp" className="cursor-pointer hover:bg-white/10">Rebalance LP (Hyperion)</SelectItem><SelectItem value="kana-trade" className="cursor-pointer hover:bg-white/10">Execute Trade (Kana Perps)</SelectItem></SelectContent></Select>
                <div>
                  <label className="text-sm font-medium text-slate-400">Amount</label>
                  <Input placeholder="e.g., 10.5" className="bg-black/30 border-white/20" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Button onClick={handleCreateWorkflow} disabled={isSubmitting} size="lg" className="mt-12 text-lg bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-8 py-4 rounded-lg border-2 border-primary/50 hover:border-primary shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300">
              {isSubmitting ? "Submitting..." : "Create Workflow"}
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}