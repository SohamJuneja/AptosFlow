# ⚡ AptosFlow

**Automate Your DeFi with Smart Workflows on Aptos**

AptosFlow is a no-code automation platform for DeFi operations on the Aptos blockchain. Create powerful, event-driven workflows that execute automatically when specific conditions are met.

![AptosFlow Banner](https://via.placeholder.com/800x400/0f172a/38bdf8?text=AptosFlow+-+DeFi+Automation)

## 🌟 Features

- **🔗 No-Code Workflow Builder** - Create complex DeFi automations without writing code
- **⚡ Real-time Triggers** - React to on-chain events like token receipts and price changes
- **🎯 Smart Actions** - Automatically execute trades, rebalance LPs, and more
- **🚀 Aptos Integration** - Native integration with Aptos blockchain and ecosystem protocols
- **📱 Beautiful UI** - Modern, responsive interface with smooth animations
- **🔐 Wallet Connect** - Secure wallet integration with multiple wallet providers

## 🛠 Supported Integrations

### Triggers
- **Receive APT** - When your wallet receives APT tokens
- **Receive USDC** - When your wallet receives USDC tokens
- **Price Changes** - When token prices move beyond thresholds

### Actions
- **Token Swaps** (Tapp.Exchange) - Automatically swap tokens
- **LP Rebalancing** (Hyperion) - Rebalance liquidity positions
- **Perp Trading** (Kana Perps) - Execute perpetual futures trades

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Aptos CLI (for smart contract deployment)
- Compatible wallet (Petra, Martian, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AptosFlow.git
   cd AptosFlow
   ```

2. **Install frontend dependencies**
   ```bash
   cd aptosflow-frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Smart Contract Deployment

1. **Install Aptos CLI**
   ```bash
   # Follow instructions at https://aptos.dev/tools/install-cli/
   ```

2. **Initialize your account**
   ```bash
   aptos init
   ```

3. **Deploy the contract**
   ```bash
   aptos move publish --named-addresses AptosFlow=your_address_here
   ```

## 📁 Project Structure

```
AptosFlow/
├── aptosflow-frontend/          # Next.js frontend application
│   ├── components/             # Reusable UI components
│   │   ├── Header.js          # Navigation header
│   │   ├── WorkflowCard.js    # Workflow display cards
│   │   └── ui/                # Base UI components
│   ├── pages/                 # Next.js pages
│   │   ├── index.js           # Home page
│   │   ├── create.js          # Workflow creation
│   │   └── templates.js       # Template gallery
│   ├── lib/                   # Utility functions
│   │   └── workflowService.js # Blockchain interaction
│   └── styles/                # Global styles
├── sources/                    # Move smart contracts
│   └── workflow.move          # Main workflow contract
├── Move.toml                  # Move project configuration
└── README.md                  # This file
```

## 🎨 Tech Stack

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Aptos Wallet Adapter** - Wallet connection and transaction signing
- **Sonner** - Beautiful toast notifications

### Blockchain
- **Aptos Blockchain** - Layer 1 blockchain for smart contracts
- **Move Language** - Smart contract programming language
- **Aptos TypeScript SDK** - Blockchain interaction library

### UI Components
- **Custom Design System** - Consistent component library
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Space-themed dark UI
- **Gradient Animations** - Cyan/blue gradient accents

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `aptosflow-frontend` directory:

```env
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_MODULE_ADDRESS=your_deployed_contract_address
```

### Wallet Configuration

The app supports multiple Aptos wallets:
- Petra Wallet
- Martian Wallet  
- Pontem Wallet
- And more...

## 📖 How It Works

1. **Connect Wallet** - Connect your Aptos wallet to the application
2. **Choose Trigger** - Select what event should start your workflow
3. **Define Action** - Choose what should happen when triggered
4. **Deploy Workflow** - Your workflow is saved on-chain
5. **Automatic Execution** - The workflow runs automatically when conditions are met

## 🎯 Example Workflows

### Funding Rate Arbitrage
- **Trigger**: Receive USDC
- **Action**: Open leveraged position on Kana Perps

### LP Rebalancing  
- **Trigger**: APT price change
- **Action**: Rebalance liquidity range on Hyperion

### Token Sniper
- **Trigger**: Receive APT  
- **Action**: Swap for new token on Tapp.Exchange

## 🛠 Development

### Running Locally

```bash
# Start frontend development server
cd aptosflow-frontend
npm run dev

# The app will be available at http://localhost:3000
```

### Building for Production

```bash
cd aptosflow-frontend
npm run build
npm start
```

### Smart Contract Development

```bash
# Compile contracts
aptos move compile

# Run tests
aptos move test

# Deploy to testnet
aptos move publish --named-addresses AptosFlow=your_address
```

## 🧪 Testing

The project includes comprehensive testing for both frontend and smart contracts:

```bash
# Frontend tests
cd aptosflow-frontend
npm run test

# Smart contract tests  
aptos move test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [aptosflow.com](https://aptosflow.com)
- **Documentation**: [docs.aptosflow.com](https://docs.aptosflow.com)
- **Discord**: [Join our community](https://discord.gg/aptosflow)
- **Twitter**: [@AptosFlow](https://twitter.com/aptosflow)

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

**Built with ❤️ for the Aptos ecosystem**