import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function LiveDemo() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [status, setStatus] = useState('idle'); // idle, sending, success
  const [triggerTx, setTriggerTx] = useState(null);

  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const MAGIC_AMOUNT = 1234500; // 0.012345 APT in octas

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
          functionArguments: ["0x1", MAGIC_AMOUNT],
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      setTriggerTx(response.hash);
      
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      setStatus('success');

    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <Header />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Autonomous Execution Demo
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Send 0.012345 APT → Receive 0.001 APT automatically
          </p>
          <p className="text-sm text-purple-300">
            Real blockchain • Real autonomous execution • Real proof
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            ⚙️ How It Works
          </h2>

          <div className="space-y-4 mb-8">
            <div className="bg-purple-500/20 rounded-xl p-6 border-l-4 border-yellow-400">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🔔</span>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">1. You Send Trigger</h3>
                  <p className="text-purple-200">
                    Click the button below to send exactly <span className="text-yellow-300 font-bold">0.012345 APT</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/20 rounded-xl p-6 border-l-4 border-green-400">
              <div className="flex items-start gap-4">
                <span className="text-4xl">⚡</span>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">2. System Responds Automatically</h3>
                  <p className="text-purple-200">
                    Backend detects your transaction and sends <span className="text-green-300 font-bold">0.001 APT</span> back (within 10 seconds)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/20 rounded-xl p-6 border-l-4 border-blue-400">
              <div className="flex items-start gap-4">
                <span className="text-4xl">📊</span>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">3. View on Aptos Explorer</h3>
                  <p className="text-purple-200">
                    Check your wallet on Aptos Explorer to see both transactions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            {connected ? (
              <button
                onClick={sendMagicTrigger}
                disabled={status === 'sending'}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  status === 'sending'
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending Transaction...
                  </span>
                ) : (
                  '🚀 Send Magic Trigger (0.012345 APT)'
                )}
              </button>
            ) : (
              <div className="text-white text-lg">
                👆 Please connect your wallet using the button above
              </div>
            )}
          </div>
        </motion.div>

        {status === 'success' && triggerTx && account && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-400"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Transaction Sent!</h2>
              <p className="text-green-200">
                Your trigger transaction has been confirmed on the blockchain
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-lg">📤 Your Trigger Transaction</h3>
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    0.012345 APT
                  </span>
                </div>
                <a
                  href={`https://explorer.aptoslabs.com/txn/${triggerTx}?network=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline break-all text-sm"
                >
                  {triggerTx}
                </a>
              </div>

              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl p-6 border border-blue-400/50">
                <div className="text-center">
                  <h3 className="text-white font-semibold text-lg mb-3">
                    👀 View All Your Transactions
                  </h3>
                  <p className="text-purple-200 text-sm mb-4">
                    Check your wallet on Aptos Explorer to see the autonomous 0.001 APT response
                    <br />
                    <span className="text-green-300 font-semibold">(Usually arrives within 10 seconds)</span>
                  </p>
                  <a
                    href={`https://explorer.aptoslabs.com/account/${account.address}/transactions?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    <span>🔍 Open Aptos Explorer</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setStatus('idle');
                    setTriggerTx(null);
                  }}
                  className="text-purple-200 hover:text-white underline"
                >
                  ← Try Another Transaction
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-purple-300 text-sm"
        >
          <p>
            💡 <strong>Backend is monitoring your wallet</strong> - it will automatically respond when it detects the magic trigger amount
          </p>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
