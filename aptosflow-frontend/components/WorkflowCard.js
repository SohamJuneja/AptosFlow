import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { formatAddress, formatTimestamp } from "@/lib/workflowService";
import { motion } from "framer-motion";
import { ExternalLink, Clock, User } from "lucide-react";

const WorkflowCard = ({ workflow }) => {
  const openExplorer = () => {
    const txHash = workflow.transactionHash || workflow.txHash;
    if (txHash) {
      window.open(`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`, "_blank");
    } else {
      console.log("No transaction hash found for workflow:", workflow);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-slate-200">
              Workflow #{workflow.id}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openExplorer}
                className="h-8 w-8 p-0 hover:bg-white/10 hover:scale-110 transition-all cursor-pointer"
                title="View on Explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Trigger Section */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-primary">When</h4>
              <p className="text-sm text-slate-300 bg-black/30 p-2 rounded border border-white/10">
                {workflow.trigger}
              </p>
            </div>

            {/* Action Section */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-accent">Then</h4>
              <p className="text-sm text-slate-300 bg-black/30 p-2 rounded border border-white/10">
                {workflow.action}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <User className="h-3 w-3" />
              <span>Owner: {formatAddress(workflow.owner)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              <span>Created: {formatTimestamp(workflow.timestamp)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WorkflowCard;