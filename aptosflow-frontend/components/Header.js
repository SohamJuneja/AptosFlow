import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  const { connect, disconnect, account, wallets } = useWallet();
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  const handleConnect = async (walletName) => {
    try { await connect(walletName); setIsWalletSelectorOpen(false); } catch (error) { console.error("Failed to connect:", error); }
  };
  const handleDisconnect = async () => {
    try { await disconnect(); } catch (error) { console.error("Failed to disconnect:", error); }
  };

  return (
    <header className="bg-transparent border-b border-white/10 backdrop-blur-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold tracking-wider hover:text-accent transition-colors cursor-pointer">
          ⚡ AptosFlow
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/templates">
            <Button variant="outline" className="bg-transparent hover:bg-white/10 hover:text-white transition-all hover:scale-105 cursor-pointer border-2 border-white/50 hover:border-white/80 px-4 py-2 rounded-lg text-white">Templates</Button>
          </Link>
          <Link href="/create">
            <Button variant="outline" className="bg-transparent hover:bg-white/10 hover:text-white transition-all hover:scale-105 cursor-pointer border-2 border-white/50 hover:border-white/80 px-4 py-2 rounded-lg text-white">Create Workflow</Button>
          </Link>
          <div className="relative">
            {!account ? (
              <>
                <Button onClick={() => setIsWalletSelectorOpen(!isWalletSelectorOpen)} className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-6 py-2 rounded-lg border-2 border-primary/50 hover:border-primary shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer transition-all duration-300">
                  Connect Wallet
                </Button>
                {isWalletSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background/80 backdrop-blur-lg rounded-lg shadow-lg border border-white/10 z-50">
                    <div className="p-2">
                      {wallets?.map((wallet) => (
                        <button key={wallet.name} onClick={() => handleConnect(wallet.name)} className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-3">
                          {wallet.icon && (<img src={wallet.icon} alt={wallet.name} className="w-6 h-6 rounded-full" />)}
                          <span>{wallet.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-black/20 border border-white/10 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-400">Connected:</span>
                  <span className="ml-2 font-mono text-sm">{account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}</span>
                </div>
                <Button onClick={handleDisconnect} variant="destructive" className="bg-red-600/80 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg border border-red-500/50 hover:border-red-500 transition-all hover:scale-105 cursor-pointer">
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;