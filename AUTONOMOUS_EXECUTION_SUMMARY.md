# 🚀 AptosFlow - Autonomous Execution System

## ✅ **FULLY FUNCTIONAL** - Real Blockchain Integration Complete!

### 🎯 What We Built

A **complete autonomous DeFi execution platform** on Aptos blockchain that:
- ✅ Detects magic trigger transactions (0.012345 APT)
- ✅ Automatically responds with 0.001 APT
- ✅ 100% real blockchain transactions
- ✅ No manual intervention required
- ✅ Full wallet integration

---

## 🏗️ System Architecture

### Frontend (`/aptosflow-frontend`)
- **Framework**: Next.js 15.5.4 + React 19.1.0
- **Wallet**: Aptos Wallet Adapter (Petra, Martian, Pontem support)
- **Live Demo Page**: `/live-demo` - Send triggers and view results on Aptos Explorer
- **Styling**: Tailwind CSS v4 with modern gradients

### Backend (`/real-execution-engine.js`)
- **Runtime**: Node.js with @aptos-labs/ts-sdk
- **Monitoring**: Polls blockchain every 10 seconds
- **Detection**: Watches specific wallet addresses for 0.012345 APT transactions
- **Response**: Automatic 0.001 APT transfer via direct blockchain transaction

### Smart Contract (`/sources/workflow.move`)
- **Deployed At**: `0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05`
- **Network**: Aptos Testnet
- **Language**: Move

---

## 💡 How It Works

### 1. User Sends Trigger
```
User → Connect Wallet → Send 0.012345 APT → Transaction Confirmed
```

### 2. Backend Detects
```
Backend polls every 10 seconds → Detects magic amount (1234500 octas) → Triggers execution
```

### 3. Autonomous Response
```
Backend → Signs transaction → Sends 0.001 APT back → Confirms on blockchain
```

### 4. User Verification
```
User → Opens Aptos Explorer → Sees both transactions → Verified!
```

---

## 🔥 Live Demo

### Start Backend
```bash
node real-execution-engine.js
```

### Start Frontend
```bash
cd aptosflow-frontend
npm run dev
```

### Access
- **Frontend**: http://localhost:3000/live-demo
- **Connect Wallet**: Use Petra, Martian, or Pontem
- **Send Trigger**: Click button to send 0.012345 APT
- **View Response**: Check Aptos Explorer (usually within 10 seconds)

---

## 📊 Verified Transactions

All transactions are verified on **Aptos Testnet Explorer**:
- https://explorer.aptoslabs.com/txn/{HASH}?network=testnet

### Example Flow:
1. **Trigger**: User sends 0.012345 APT → TX confirmed
2. **Response**: System sends 0.001 APT back → TX confirmed
3. **Proof**: Both visible on Aptos Explorer

---

## 🔑 Configuration

### Environment Variables (`.env`)
```bash
APTOS_PRIVATE_KEY="0x..." # Executor wallet private key
MODULE_ADDRESS="0xd2d618ed..." # Smart contract address
# HTTPS_URL="https://aptos-testnet.nodit.io" # Optional Nodit RPC
```

### Monitored Addresses
Located in `real-execution-engine.js`:
```javascript
const MONITORED_ADDRESSES = [
  "0x32a7fe0f2bca2560ae46b21cc956a93c5ff0494206569c6e23ea652f45c2b512",
  // Add more addresses here
];
```

---

## 💰 Magic Amounts

```javascript
const MAGIC_TRIGGER_AMOUNT = 1234500; // 0.012345 APT (trigger)
const EXECUTION_AMOUNT = 100000;      // 0.001 APT (response)
```

**Conversion**: 1 APT = 100,000,000 octas (10^8)

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15.5.4, React 19.1.0, Tailwind CSS v4 |
| Wallet | @aptos-labs/wallet-adapter-react |
| Backend | Node.js, @aptos-labs/ts-sdk v5.1.0 |
| Blockchain | Aptos Testnet |
| Smart Contract | Move Language |
| Animation | Framer Motion |

---

## 📁 Key Files

```
AptosFlow/
├── real-execution-engine.js      # Autonomous backend
├── aptosflow-frontend/
│   └── pages/
│       └── live-demo.js          # Main demo page
├── sources/
│   └── workflow.move             # Smart contract
├── .env                          # Configuration
└── README.md                     # Documentation
```

---

## 🎬 Demo System (Optional)

For presentations, use the visual demo:

```bash
# Start demo server
node demo-server.js

# Access at
http://localhost:9090
```

---

## 🚨 Important Notes

1. **Backend Must Be Running**: The execution engine must be active to detect and respond
2. **Wallet Balance**: Executor needs sufficient APT for gas fees + responses
3. **Network**: Currently on Aptos Testnet (switch to mainnet requires redeployment)
4. **Security**: Never commit `.env` file with real private keys

---

## 🔗 Links

- **GitHub**: https://github.com/SohamJuneja/AptosFlow
- **Aptos Explorer**: https://explorer.aptoslabs.com/?network=testnet
- **Smart Contract**: `0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05`
- **User Wallet**: `0x32a7fe0f2bca2560ae46b21cc956a93c5ff0494206569c6e23ea652f45c2b512`

---

## ✨ Current Status

✅ **Production Ready** - Fully functional autonomous execution system  
✅ **Real Transactions** - All on Aptos blockchain  
✅ **Verified** - Multiple successful executions confirmed  
✅ **Open Source** - Available on GitHub  

---

## 🎉 Success Metrics

- ✅ Backend detects triggers within 10 seconds
- ✅ Automatic responses confirmed on blockchain
- ✅ Frontend displays transaction links correctly
- ✅ Complete end-to-end flow working
- ✅ Verified on Aptos Explorer

---

**Built with ❤️ on Aptos Blockchain**
