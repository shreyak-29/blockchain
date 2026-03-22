# 🏘️ Blockchain Real Estate Registry

A decentralized application (dApp) for managing property ownership on the Ethereum blockchain. Built with Solidity, Hardhat, Next.js, and Ethers.js.

![Blockchain Real Estate](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-orange)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📋 **Register Properties** - Add property details to the blockchain
- 🔄 **Transfer Ownership** - Securely transfer properties to new owners
- 🔍 **Verify Properties** - Search and view property information
- 💰 **Gas Fee Tracking** - Real-time gas usage and cost display
- 🔗 **Block Explorer Integration** - Direct links to Etherscan
- 🌓 **Dark/Light Mode** - Toggle between themes
- 🌐 **Multi-Network Support** - Works on Local, Testnet, and Mainnet
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Smart Contract
- Solidity 0.8.28
- Hardhat
- Ethers.js v6

### Frontend
- Next.js 16
- React 19
- Tailwind CSS 4
- Ethers.js v6

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd blockchain_project
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Start local blockchain**
```bash
npx hardhat node
```
Keep this terminal running.

4. **Deploy contract** (in a new terminal)
```bash
npx hardhat run scripts/deploy.js --network localhost
```
Note the contract address (usually `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

5. **Configure MetaMask**
- Add Hardhat Local network:
  - Network Name: `Hardhat Local`
  - RPC URL: `http://127.0.0.1:8545`
  - Chain ID: `31337`
  - Currency: `ETH`
- Import a test account using one of the private keys from step 3

6. **Start frontend**
```bash
cd frontend
npm run dev
```

7. **Open browser**
Visit `http://localhost:3000`

## 📖 Usage

### Register a Property
1. Go to "Register Property" page
2. Enter Property ID (e.g., 1)
3. Enter Location (e.g., "123 Main St, New York")
4. Enter Price in Wei (e.g., 1000000000000000000 for 1 ETH)
5. Click "Register Property"
6. Confirm transaction in MetaMask
7. View transaction details with gas fees

### Transfer Property
1. Go to "Transfer Property" page
2. Enter Property ID
3. Enter new owner's Ethereum address
4. Click "Transfer Property"
5. Confirm transaction in MetaMask
6. View transaction on block explorer

### Verify Property
1. Go to "Verify Property" page
2. Enter Property ID
3. Click "Search Property"
4. View property details including owner address

## 🌐 Network Support

The application automatically detects and supports:

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Hardhat Local | 31337 | - |
| Ethereum Mainnet | 1 | etherscan.io |
| Sepolia Testnet | 11155111 | sepolia.etherscan.io |
| Goerli Testnet | 5 | goerli.etherscan.io |
| Polygon Mainnet | 137 | polygonscan.com |
| Mumbai Testnet | 80001 | mumbai.polygonscan.com |

## 📦 Smart Contract

### RealEstate.sol

```solidity
// Main functions
function registerProperty(uint256 _id, string memory _location, uint256 _price)
function transferProperty(uint256 _id, address newOwner)
function getProperty(uint256 _id) view returns(uint256, string, uint256, address)
```

### Contract Structure
```
Property {
  uint256 id;
  string location;
  uint256 price;
  address owner;
}
```

## 🎨 Features in Detail

### Transaction Details
Every transaction shows:
- 📝 Transaction Hash (with Etherscan link)
- 📦 Block Number (with block explorer link)
- 👤 From Address (sender)
- 📍 To Address (contract)
- ⛽ Gas Used
- 💰 Gas Price (in Gwei)
- 💸 Total Gas Fees (in ETH)
- ✅ Status (Success/Failed)

### Error Handling
- Property not found errors
- Ownership verification
- Invalid address format detection
- Insufficient funds warnings
- Network error handling
- User-friendly error messages

### Dark/Light Mode
- Automatic theme persistence
- Smooth transitions
- Optimized for both modes

## 🚀 Deployment

### Testnet (Sepolia)

1. **Get Sepolia ETH**
   - https://sepoliafaucet.com/

2. **Update hardhat.config.js**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

3. **Create .env file**
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-private-key-here
```

4. **Deploy**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

5. **Update frontend contract address**
Edit `frontend/utils/contract.js` with new address

6. **Verify on Etherscan**
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📁 Project Structure

```
blockchain_project/
├── contracts/
│   └── RealEstate.sol          # Smart contract
├── scripts/
│   └── deploy.js               # Deployment script
├── frontend/
│   ├── components/
│   │   ├── Navbar.js           # Navigation bar
│   │   ├── NetworkInfo.js      # Network status display
│   │   └── ThemeToggle.js      # Dark/Light mode toggle
│   ├── pages/
│   │   ├── index.js            # Home page
│   │   ├── register.js         # Register property
│   │   ├── transfer.js         # Transfer property
│   │   └── view.js             # View property
│   ├── styles/
│   │   └── globals.css         # Global styles
│   └── utils/
│       └── contract.js         # Contract interaction
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Dependencies
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
└── README.md                   # This file
```

## 🔧 Configuration

### Contract Address
Update in `frontend/utils/contract.js`:
```javascript
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```

### Supported Networks
Add more networks in `frontend/utils/contract.js`:
```javascript
const networkNames = {
  1: { name: "Ethereum Mainnet", explorer: "https://etherscan.io" },
  11155111: { name: "Sepolia Testnet", explorer: "https://sepolia.etherscan.io" },
  // Add more networks...
};
```

## 🐛 Troubleshooting

### Common Issues

**"Property not found"**
- Make sure the property is registered first
- Check you're on the correct network

**"Not owner" error**
- Only the property owner can transfer it
- Verify you're using the correct MetaMask account

**"Insufficient funds"**
- Ensure you have enough ETH for gas fees
- For testnet, get free ETH from faucets

**MetaMask not connecting**
- Refresh the page
- Check MetaMask is unlocked
- Try resetting MetaMask account

## 📊 Gas Estimates

| Operation | Gas Used | Cost (at 50 Gwei) |
|-----------|----------|-------------------|
| Deploy Contract | ~715,000 | ~0.036 ETH |
| Register Property | ~112,000 | ~0.006 ETH |
| Transfer Property | ~50,000 | ~0.003 ETH |
| View Property | 0 (read-only) | Free |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- OpenZeppelin for smart contract best practices
- Hardhat team for the development environment
- Ethers.js for blockchain interaction
- Next.js team for the React framework

---

Made with ❤️ using Blockchain Technology
