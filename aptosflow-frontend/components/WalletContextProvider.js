import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";

const WalletContextProvider = ({ children }) => {
  const wallets = [new PetraWallet(), new PontemWallet(), new MartianWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{
        network: Network.TESTNET, // or Network.MAINNET
        // Optional: Add your app name
        aptosConnectDappId: "your-dapp-id-here" // Get this from Aptos Connect
      }}
      onError={(error) => {
        console.log("Wallet error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default WalletContextProvider;