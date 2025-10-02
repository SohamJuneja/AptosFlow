import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast } from "sonner";
import { motion } from "framer-motion";

const aptosConfig = new AptosConfig({ network: Network.TESTNET, fullnode: "https://aptos-testnet.nodit.io/v1" });
const aptos = new Aptos(aptosConfig);
const MODULE_ADDRESS = "0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05";

const stringToHex = (str) => '0x' + Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

export default function CreateWorkflow() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [prompt, setPrompt] = useState("");
  
  // State will now hold the full objects from the AI
  const [trigger, setTrigger] = useState(null);
  const [actions, setActions] = useState([]);
  
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParsePrompt = async () => {
    if (!prompt) {
      toast.error("Please enter a command for the AI.");
      return;
    }
    setIsParsing(true);
    toast.loading("Interpreting your command...");

    try {
      const response = await fetch('/api/parse-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.error) {
        toast.error("AI could not understand the command.", { description: data.error });
        setTrigger(null);
        setActions([]);
      } else {
        toast.success("AI command parsed successfully!");
        setTrigger(data.trigger || null);
        setActions(data.actions || []);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to communicate with AI.", { description: error.message });
    } finally {
      setIsParsing(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!account || !trigger || actions.length === 0) {
      toast.error("Please parse a valid command with the AI first.");
      return;
    }
    setIsSubmitting(true);
    toast.loading("Submitting transaction...");
    
    // We can now build a much richer payload
    const actionPayloadObject = { trigger, actions };
    const actionDescription = `AI Workflow: ${actions.map(a => a.type).join(', ')}`;
    const payloadString = JSON.stringify(actionPayloadObject);
    const hexPayload = stringToHex(payloadString);

    const transaction = {
      sender: account.address,
      data: {
        function: `${MODULE_ADDRESS}::workflow::create_workflow`,
        functionArguments: [prompt, actionDescription, hexPayload],
      },
    };
    try {
      const response = await signAndSubmitTransaction(transaction);
      toast.dismiss();
      toast.success("Workflow submitted successfully!", { description: `Transaction hash: ${response.hash.slice(0, 10)}...`, action: { label: "View on Explorer", onClick: () => window.open(`https://explorer.aptoslabs.com/txn/${response.hash}?network=testnet`, "_blank"), }, });
    } catch (error) {
      toast.dismiss();
      toast.error("Transaction failed.", { description: error.message || "Please try again.", });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head><title>Create AI Workflow - AptosFlow</title></Head>
      <main className="flex min-h-screen flex-col text-white">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-bold mb-8">Create Workflow with AI</motion.h1>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full max-w-2xl">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-center text-2xl text-slate-200">Describe your desired workflow</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., 'when i get usdc, swap it on tapp for apt'"
                  className="bg-black/30 border-white/20 min-h-[100px] text-lg font-mono"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button onClick={handleParsePrompt} disabled={isParsing} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isParsing ? "Interpreting..." : "Interpret with AI"}
                </Button>
                
                {/* THIS IS THE CORRECTED DISPLAY LOGIC */}
                {(trigger || actions.length > 0) && (
                  <div className="text-sm p-4 bg-black/30 rounded-lg border border-white/20">
                    <p className="font-bold mb-2">AI Interpretation:</p>
                    <pre className="text-xs text-left whitespace-pre-wrap font-mono">
                      {JSON.stringify({ trigger, actions }, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Button onClick={handleCreateWorkflow} disabled={isSubmitting || !trigger || actions.length === 0} size="lg" className="mt-12 text-lg bg-primary hover:bg-accent text-primary-foreground font-bold shadow-glow-cyan-light hover:shadow-glow-cyan transition-all transform hover:scale-105">
              {isSubmitting ? "Submitting..." : "Create Workflow from AI Result"}
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}