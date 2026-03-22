# 🚀 Blockchain Real Estate Registry - Deployment Guide

## 📋 Table of Contents
- [Local Development](#local-development)
- [Testnet Deployment (Sepolia)](#testnet-deployment-sepolia)
- [Mainnet Deployment](#mainnet-deployment)
- [Frontend Configuration](#frontend-configuration)

---

## 🏠 Local Development

### 1. Start Hardhat Node
```bash
npx hardhat node
```
This will start a local blockchain at `http://127.0.0.1:8545/`

### 2. Deploy Contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```
Note the deployed contract address (usually `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

### 3. Configure MetaMask
- Network Name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

### 4. Import Test Account
Import one of the private keys shown when you started Hardhat node.

### 5. Run Frontend
```bash
cd frontend
npm run dev
```
Visit `http://localhost:3000`

---

## 🌐 Testnet Deployment (Sepolia)

### Prerequisites
1. Get Sepolia ETH from faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. Get Alchemy/Infura API Key:
   - Alchemy: https://www.alchemy.com/
   - Infura: https://infura.io/

### Step 1: Update hardhat.config.js

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### Step 2: Create .env file

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-wallet-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
```

⚠️ **IMPORTANT**: Add `.env` to `.gitignore`!

### Step 3: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 4: Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Step 5: Update Frontend

Update `frontend/utils/contract.js`:
```javascript
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### Step 6: Configure MetaMask for Sepolia

MetaMask usually has Sepolia pre-configured. If not:
- Network Name: `Sepolia Testnet`
- RPC URL: `https://sepolia.infura.io/v3/YOUR-API-KEY`
- Chain ID: `11155111`
- Currency Symbol: `ETH`
- Block Explorer: `https://sepolia.etherscan.io`

### Step 7: Test on Sepolia

1. Visit your frontend
2. Connect MetaMask (Sepolia network)
3. Register a property
4. View transaction on Etherscan: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`

---

## 🌍 Mainnet Deployment

⚠️ **WARNING**: Mainnet deployment costs real money! Test thoroughly on testnet first.

### Step 1: Update hardhat.config.js

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### Step 2: Update .env

```bash
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-wallet-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
```

### Step 3: Deploy to Mainnet

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Step 4: Verify on Etherscan

```bash
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```

---

## 🎨 Frontend Configuration

### Update Contract Address

Edit `frontend/utils/contract.js`:

```javascript
// For Local
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// For Sepolia
const contractAddress = "0xYourSepoliaContractAddress";

// For Mainnet
const contractAddress = "0xYourMainnetContractAddress";
```

### Supported Networks

The frontend automatically detects:
- ✅ Hardhat Local (Chain ID: 31337)
- ✅ Ethereum Mainnet (Chain ID: 1)
- ✅ Sepolia Testnet (Chain ID: 11155111)
- ✅ Goerli Testnet (Chain ID: 5)
- ✅ Polygon Mainnet (Chain ID: 137)
- ✅ Mumbai Testnet (Chain ID: 80001)

### Block Explorer Links

Links automatically work for:
- **Mainnet**: https://etherscan.io
- **Sepolia**: https://sepolia.etherscan.io
- **Goerli**: https://goerli.etherscan.io
- **Polygon**: https://polygonscan.com
- **Mumbai**: https://mumbai.polygonscan.com

---

## 📊 Gas Estimates

### Local Network (Hardhat)
- Deploy Contract: ~715,000 gas
- Register Property: ~112,000 gas
- Transfer Property: ~50,000 gas

### Sepolia Testnet
- Similar to local, but with real network conditions
- Gas price: ~1-5 Gwei
- Cost: ~$0.01-0.05 per transaction

### Mainnet
- Gas price varies: 20-100+ Gwei
- Deploy: $50-$200
- Register: $5-$20
- Transfer: $2-$10

---

## 🔗 Useful Links

### Faucets (Free Testnet ETH)
- Sepolia: https://sepoliafaucet.com/
- Alchemy Faucet: https://www.alchemy.com/faucets/ethereum-sepolia

### RPC Providers
- Alchemy: https://www.alchemy.com/
- Infura: https://infura.io/
- QuickNode: https://www.quicknode.com/

### Block Explorers
- Etherscan: https://etherscan.io
- Sepolia Etherscan: https://sepolia.etherscan.io

### Documentation
- Hardhat: https://hardhat.org/docs
- Ethers.js: https://docs.ethers.org/v6/
- MetaMask: https://docs.metamask.io/

---

## 🐛 Troubleshooting

### "Insufficient funds for gas"
- Make sure you have enough ETH in your wallet
- For testnet, get free ETH from faucets

### "Nonce too high"
- Reset MetaMask account: Settings → Advanced → Reset Account

### "Network error"
- Check your RPC URL is correct
- Try a different RPC provider

### "Property not found"
- Make sure the property is registered first
- Check you're on the correct network

### Contract not verified on Etherscan
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## 📝 Notes

1. **Never commit private keys** to Git
2. **Always test on testnet** before mainnet
3. **Keep your .env file secure**
4. **Backup your private keys** safely
5. **Monitor gas prices** before deploying to mainnet

---

## 🎉 Success!

Once deployed, you can:
- ✅ Register properties on blockchain
- ✅ Transfer ownership securely
- ✅ Verify properties publicly
- ✅ View all transactions on Etherscan
- ✅ Track gas fees and costs

Happy deploying! 🚀
