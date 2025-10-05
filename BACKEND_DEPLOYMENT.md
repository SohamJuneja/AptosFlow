# Backend Deployment Guide

The autonomous execution engine (`real-execution-engine.js`) needs to run 24/7 on a server for the deployed frontend to work properly.

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Create account** at [railway.app](https://railway.app)
2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```
3. **Login to Railway**
   ```bash
   railway login
   ```
4. **Deploy**
   ```bash
   railway init
   railway up
   ```
5. **Add environment variables** in Railway dashboard:
   - `APTOS_PRIVATE_KEY`: Your executor private key
   - `MODULE_ADDRESS`: The smart contract address

### Option 2: Render

1. **Create account** at [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect GitHub repo**
4. **Configure**:
   - Build Command: `npm install`
   - Start Command: `node real-execution-engine.js`
5. **Add environment variables**:
   - `APTOS_PRIVATE_KEY`
   - `MODULE_ADDRESS`

### Option 3: DigitalOcean App Platform

1. **Create account** at [digitalocean.com](https://digitalocean.com)
2. **Create new App**
3. **Connect GitHub repo**
4. **Configure run command**: `node real-execution-engine.js`
5. **Add environment variables**

### Option 4: AWS EC2 (Advanced)

1. **Launch EC2 instance** (Ubuntu)
2. **SSH into server**
3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. **Clone repo and install**:
   ```bash
   git clone https://github.com/SohamJuneja/AptosFlow.git
   cd AptosFlow
   npm install
   ```
5. **Create .env file**:
   ```bash
   nano .env
   # Add APTOS_PRIVATE_KEY and MODULE_ADDRESS
   ```
6. **Install PM2** (process manager):
   ```bash
   npm install -g pm2
   pm2 start real-execution-engine.js
   pm2 save
   pm2 startup
   ```

## Environment Variables Required

```bash
APTOS_PRIVATE_KEY="your_executor_private_key"
MODULE_ADDRESS="0xd2d618ed1248e1ac5f715991af3de929f8f4aa064983956c01ca77521178ed05"
```

## Verify Deployment

Once deployed, your backend should:
- ✅ Show "Backend is running" in logs
- ✅ Display executor balance
- ✅ Poll blockchain every 10 seconds
- ✅ Respond to 0.012345 APT trigger transactions

## Cost Comparison

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Railway | 500 hours/month | $5/month |
| Render | 750 hours/month | $7/month |
| DigitalOcean | No free tier | $4/month |
| AWS EC2 | 750 hours/month (12 months) | Varies |

## Monitoring

Add health checks to ensure the backend stays running:
- Check logs regularly
- Monitor executor balance
- Set up alerts for errors

## Security Notes

⚠️ **Never commit private keys to GitHub!**
- Always use environment variables
- Keep `.env` in `.gitignore`
- Use separate keys for testnet and mainnet
