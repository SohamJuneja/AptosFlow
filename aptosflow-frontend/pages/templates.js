import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion"; // This is the missing import line

const templates = [
  {
    title: "Funding Rate Arbitrage Bot",
    description: "When you receive USDC, automatically open a leveraged position to capture funding rate differences.",
    sponsor: "Kana Perps",
    trigger: "receive-usdc",
    action: "kana-trade",
  },
  {
    title: "Automated LP Rebalancing",
    description: "When the price of APT moves, automatically re-deploy your liquidity to a new, more effective range.",
    sponsor: "Hyperion",
    trigger: "price-change-apt",
    action: "hyperion-lp",
  },
  {
    title: "New Pool Sniper",
    description: "When you receive APT, automatically swap it for a new token on a high-yield farm.",
    sponsor: "Tapp.Exchange",
    trigger: "receive-apt",
    action: "tapp-swap",
  },
];

export default function Templates() {
  return (
    <>
      <Head>
        <title>Templates - AptosFlow</title>
      </Head>
      <main className="flex min-h-screen flex-col bg-slate-950 text-white">
        <Header />
        <div className="container mx-auto p-4 flex-1 flex flex-col items-center text-center mt-16">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl font-extrabold tracking-tight mb-4">
            Discover Workflow Templates
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-lg text-slate-400 max-w-2xl mb-8">
            Get started instantly with pre-built recipes designed to maximize your DeFi strategy.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {templates.map((template, index) => (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-slate-900 border-slate-700 text-left flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription className="text-slate-400">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <span className="text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-700 px-2 py-1 rounded-full">
                      Integrates with {template.sponsor}
                    </span>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/create?trigger=${template.trigger}&action=${template.action}`} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-6 py-3 rounded-lg border-2 border-primary/50 hover:border-primary shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer transition-all duration-300">
                        Use Template
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}