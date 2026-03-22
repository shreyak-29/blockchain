require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // Local Hardhat Network (default)
    hardhat: {
      chainId: 31337
    },
    
    // Localhost (for npx hardhat node)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    
    // Sepolia Testnet
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/rIEXyzzf6r8O0fIvEzEDu",
      accounts: ["07ebe233f626a367ce685af0542a1aa3d1baa29e5fd4c5275380a6c3320097df"],
      chainId: 11155111
    }
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
