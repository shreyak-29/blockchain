# 🏘️ Blockchain Real Estate Registry

A decentralized application (dApp) for managing property ownership on the Ethereum blockchain with advanced features like Google Maps integration, auto-generated Property IDs, and location validation.

![Blockchain Real Estate](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Features
- 📋 **Register Properties** - Add property details with name, location, and price to the blockchain
- 🏠 **Auto-Generated Property IDs** - Unique IDs are automatically generated for each property
- 📍 **Google Maps Integration** - Select property location directly from the map
- 🚫 **Duplicate Prevention** - Prevents multiple properties from being registered at the same location
- 🔄 **Transfer Ownership** - Securely transfer properties to new owners using Property ID
- 🔍 **Verify Properties** - Search and view detailed property information
- 💰 **Gas Fee Tracking** - Real-time gas usage and cost display
- 🔗 **Block Explorer Integration** - Direct links to view transactions on Etherscan
- 🌓 **Dark/Light Mode** - Toggle between themes for better user experience
- 🌐 **Multi-Network Support** - Works on Local Hardhat, Sepolia Testnet, and Mainnet
- 📱 **Responsive Design** - Optimized for all devices

### Advanced Features
- 🗺️ **Interactive Maps** - Real-time visualization of all registered properties
- 🎯 **Property Name Field** - Add descriptive names to your properties
- 📌 **Location Coordinates** - Store GPS coordinates with properties
- 🔐 **Copy Property ID** - Easy clipboard copy functionality for sharing IDs
- 📊 **Property Analytics** - View registered properties list with details

## 🛠️ Tech Stack

### Smart Contract
- **Solidity 0.8.20** - Smart contract language
- **Hardhat** - Ethereum development environment
- **Ethers.js v6** - Blockchain interaction library

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Google Map React** - Map visualization
- **Ethers.js v6** - Web3 integration
- **React Hot Toast** - Notifications

## 📋 Smart Contract Structure

### Property Structure
```solidity
struct Property {
    uint id;              // Auto-generated unique ID
    string name;          // Property name
    string location;      // Location string
    uint price;           // Price in Wei
    address owner;        // Owner wallet address
    uint latitude;        // GPS latitude (fixed point)
    uint longitude;       // GPS longitude (fixed point)
}
```

### Key Contract Functions
- `registerProperty()` - Register a new property (returns auto-generated ID)
- `transferProperty()` - Transfer property ownership
- `getProperty()` - Retrieve property details by ID
- `getNextPropertyId()` - Get next available property ID
- `getAllProperties()` - Get paginated list of all properties

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MetaMask browser extension
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd blockchain
npm install
cd frontend && npm install && cd ..
```

2. **Start Hardhat Node** (Terminal 1)
```bash
npm run node
```
This will:
- Start a local Ethereum node
- Auto-deploy the smart contract
- Save contract address to `frontend/contractAddress.json`
- Display test accounts with private keys

3. **Run Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
Open [localhost:3000](http://localhost:3000)

### MetaMask Setup (First Time)

1. **Add Hardhat Network**
   - Click MetaMask → Settings → Networks → Add Network
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Import Test Account**
   - Click MetaMask → Create Account
   - Select "Import Account"
   - Copy private key from Hardhat node output
   - Paste into MetaMask
   - You'll have ~10,000 test ETH

## 📖 Usage Guide

### 1. Registering a Property ✅

**Steps:**
1. Go to **Register** page
2. **Enter Property Name** - e.g., "Downtown Penthouse"
3. **Property ID** - Auto-generated (can copy for later use)
4. **Click on Map** - Select property location
   - 🟢 Green marker = Your selection
   - 🔴 Red markers = Existing properties
5. **Set Price** - Enter in ETH (e.g., 1.5)
6. **Click Register** - Confirm in MetaMask
7. **Save Property ID** - You'll need it for transfers!

**Important:**
- Each location can only have one registered property
- Save the Property ID immediately after registration
- The map prevents registering within ~100m of existing properties

### 2. Verifying Properties 🔍

**Steps:**
1. Go to **Verify** page
2. Enter **Property ID**
3. Click **Search**
4. View all property details:
   - Name and location
   - Owner address
   - Price (in ETH & Wei)
   - GPS coordinates
   - Transaction hash

### 3. Transferring Ownership 🔄

**Steps:**
1. Go to **Transfer** page
2. Enter **Property ID** (must be owner)
3. Enter **New Owner Address**
4. Confirm transaction
5. New owner listed immediately

## 🗺️ Map Features

- **Click to Select** - Click anywhere to mark your property
- **Red Markers** - Show all existing properties with names and IDs
- **Green Marker** - Your selected location while registering
- **Hover Info** - See property details on marker hover
- **Duplicate Prevention** - Can't register within 100m of existing properties

## 🔐 Security & Features

✅ MetaMask wallet integration  
✅ Transaction verification  
✅ Gas fee estimation  
✅ Owner verification  
✅ Location-based duplicate prevention  
✅ Real-time error messages  
✅ Blockchain transparency  

## 📊 Transaction Details

Every transaction displays:
- 📝 Transaction Hash (clickable Etherscan link)
- 📦 Block Number
- 🏠 Property ID (copyable)
- ⛽ Gas Used
- 💰 Gas Price (Gwei)
- 💸 Total Gas Fees (ETH)
- ✅ Status

## 🌐 Supported Networks

| Network          | RPC                   | Chain ID | Status       |
| ---------------- | --------------------- | -------- | ------------ |
| Hardhat Local    | http://127.0.0.1:8545 | 31337    | ✅ Dev        |
| Sepolia Testnet  | Configured            | 11155111 | ⚠️ Testnet    |
| Ethereum Mainnet | Configured            | 1        | ⚠️ Production |

## 💡 Pro Tips

- **Always Save Property ID** - Can't recover if lost
- **Use Unique Names** - Helps identify properties on map
- **Check Map First** - Avoid duplicate location registrations  
- **Monitor Gas** - Check before confirming transactions
- **Test First** - Use Hardhat for testing before Testnet

## 🐛 Troubleshooting

| Problem                  | Solution                         |
| ------------------------ | -------------------------------- |
| "Cannot connect"         | Ensure `npm run node` is running |
| "Property exists here"   | Select different location on map |
| "Insufficient funds"     | Check MetaMask has test ETH      |
| "MetaMask not connected" | Approve connection in popup      |
| "Property not found"     | Verify correct Property ID       |
| "Map not showing"        | Check Google Maps API key        |

## 📁 Project Structure

```
blockchain/
├── contracts/
│   └── RealEstate.sol           # Smart contract
├── scripts/
│   └── deploy.js                # Deployment script
├── frontend/
│   ├── pages/
│   │   ├── index.js             # Home
│   │   ├── register.js          # Register (with maps)
│   │   ├── transfer.js          # Transfer
│   │   └── view.js              # Verify
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── NetworkInfo.js
│   │   └── ThemeToggle.js
│   ├── utils/
│   │   └── contract.js
│   ├── styles/
│   │   └── globals.css
│   └── contractAddress.json     # Auto-generated
├── start-hardhat.mjs            # Auto-deploy script
└── hardhat.config.js            # Config
```

## 🔧 Commands

```bash
# Start with auto-deployment
npm run node

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to specific network
npx hardhat run scripts/deploy.js --network localhost
```

## 🎯 Future Enhancements

- [ ] Property images
- [ ] Rental listings
- [ ] NFT integration
- [ ] DAO governance
- [ ] Multi-signature wallets
- [ ] Advanced analytics
- [ ] Mobile app

## 📜 License

MIT - Feel free to use and modify!

---

**Questions or Issues?** Open a GitHub issue!

**Built with ❤️ using Blockchain Technology**
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

| Operation         | Gas Used      | Cost (at 50 Gwei) |
| ----------------- | ------------- | ----------------- |
| Deploy Contract   | ~715,000      | ~0.036 ETH        |
| Register Property | ~112,000      | ~0.006 ETH        |
| Transfer Property | ~50,000       | ~0.003 ETH        |
| View Property     | 0 (read-only) | Free              |

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
