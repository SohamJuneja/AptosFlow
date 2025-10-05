import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { motion } from 'framer-motion';

export default function LiveDemo() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [status, setStatus] = useState('idle'); // idle, sending, success
  const [triggerTx, setTriggerTx] = useState(null);

  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const MAGIC_AMOUNT = 1234500; // 0.012345 APT in octas (1 APT = 100,000,000 octas)

  const sendMagicTrigger = async () => {
    if (!connected || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setStatus('sending');

      const transaction = {
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: ["0x1", MAGIC_AMOUNT], // Send to burn address
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      setTriggerTx(response.hash);
      
      // Wait for confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      setStatus('success');

    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Live Autonomous Execution Demo
          </h1>
          <p className="text-xl text-purple-200">
            Real blockchain transactions • Real autonomous execution • Real proof
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Workflow Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              ⚙️ Active Workflow
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-purple-500/20 rounded-xl p-6 border-l-4 border-yellow-400">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🔔</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Trigger</h3>
                    <p className="text-purple-200">
                      When someone sends exactly <span className="text-yellow-300 font-bold">0.012345 APT</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/20 rounded-xl p-6 border-l-4 border-green-400">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">⚡</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Action</h3>
                    <p className="text-purple-200">
                      System automatically sends <span className="text-green-300 font-bold">0.001 APT</span> back
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            {connected ? (
              <button
                onClick={sendMagicTrigger}
                disabled={status === 'monitoring' || status === 'sending'}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  status === 'monitoring' || status === 'sending'
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/50'
                } text-white`}
              >
                {status === 'sending' && '⏳ Sending Transaction...'}
                {status === 'monitoring' && '👀 Monitoring for Response...'}
                {status === 'completed' && '✅ Completed! Send Another?'}
                {status === 'idle' && '🎯 Send Magic Trigger (0.012345 APT)'}
              </button>
            ) : (
              <div className="text-center py-4 text-yellow-300 bg-yellow-500/20 rounded-xl">
                ⚠️ Please connect your wallet to start the demo
              </div>
            )}

            {/* Status Indicators */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-white">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span>Wallet: {connected ? 'Connected' : 'Not Connected'}</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className={`w-3 h-3 rounded-full ${monitoring ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span>Monitoring: {monitoring ? 'Active' : 'Idle'}</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className={`w-3 h-3 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span>Status: {status === 'completed' ? 'Execution Complete' : 'Waiting'}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Live Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              📝 Live Execution Logs
            </h2>

            <div className="bg-black/50 rounded-xl p-4 h-[500px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  Waiting for execution...
                </div>
              ) : (
                logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-2 p-2 rounded ${
                      log.type === 'success' ? 'bg-green-500/20 border-l-2 border-green-500' :
                      log.type === 'error' ? 'bg-red-500/20 border-l-2 border-red-500' :
                      log.type === 'warning' ? 'bg-yellow-500/20 border-l-2 border-yellow-500' :
                      'bg-blue-500/10 border-l-2 border-blue-500'
                    }`}
                  >
                    <span className="text-gray-400">[{log.time}]</span>{' '}
                    <span className="text-white">{log.message}</span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Transaction Cards */}
        {(triggerTx || responseTx) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Trigger Transaction */}
            {triggerTx && (
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🎯 Trigger Transaction
                </h3>
                <div className="space-y-3 text-white">
                  <div>
                    <span className="text-yellow-200">Amount:</span>
                    <span className="ml-2 font-bold">0.012345 APT</span>
                  </div>
                  <div>
                    <span className="text-yellow-200">To:</span>
                    <span className="ml-2 text-sm font-mono">0x1 (burn)</span>
                  </div>
                  <div className="break-all">
                    <span className="text-yellow-200">TX Hash:</span>
                    <div className="mt-1 text-xs font-mono bg-black/30 p-2 rounded">
                      {triggerTx}
                    </div>
                  </div>
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${triggerTx}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg text-center transition-all"
                  >
                    🔗 View on Explorer
                  </a>
                </div>
              </div>
            )}

            {/* Response Transaction */}
            {responseTx && (
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🤖 Autonomous Response
                </h3>
                <div className="space-y-3 text-white">
                  <div>
                    <span className="text-green-200">Amount:</span>
                    <span className="ml-2 font-bold">0.001 APT</span>
                  </div>
                  <div>
                    <span className="text-green-200">From:</span>
                    <span className="ml-2 text-xs font-mono">Executor</span>
                  </div>
                  <div className="break-all">
                    <span className="text-green-200">TX Hash:</span>
                    <div className="mt-1 text-xs font-mono bg-black/30 p-2 rounded">
                      {responseTx}
                    </div>
                  </div>
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${responseTx}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-all"
                  >
                    🔗 View on Explorer
                  </a>
                  <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                    <span className="text-green-300 font-bold">
                      ✨ EXECUTED AUTONOMOUSLY!
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
        >
          <h3 className="text-xl font-bold text-white mb-3">ℹ️ How This Works</h3>
          <div className="text-blue-200 space-y-2">
            <p>1. Click the button to send <strong>0.012345 APT</strong> from your connected wallet</p>
            <p>2. The system detects your transaction on the blockchain</p>
            <p>3. Autonomous execution engine automatically sends <strong>0.001 APT</strong> back to you</p>
            <p>4. Both transactions are <strong>100% real</strong> and verifiable on Aptos Explorer</p>
            <p className="text-yellow-300 font-semibold mt-4">⚠️ Make sure the execution engine is running: <code className="bg-black/30 px-2 py-1 rounded">node real-execution-engine.js</code></p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
