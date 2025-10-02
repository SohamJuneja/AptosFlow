import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import WalletContextProvider from "@/components/WalletContextProvider";

export default function App({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
      <Toaster richColors />
    </WalletContextProvider>
  );
}