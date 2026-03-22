import { ethers } from "ethers";
import toast from "react-hot-toast";

// Local Hardhat Network Contract Address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function registerProperty(uint256 _id, string memory _location, uint256 _price)",
  "function transferProperty(uint256 _id, address newOwner)",
  "function getProperty(uint256 _id) view returns(uint256, string memory, uint256, address)",
];

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    return contract;
  } catch (error) {
    if (error.code === -32002) {
      alert(
        "Connection request pending. Please check MetaMask and approve the connection.",
      );
    } else if (error.code === 4001) {
      alert("Connection rejected. Please connect your wallet to use this app.");
    } else {
      console.error("Error connecting to contract:", error);
      alert("Failed to connect. Please refresh and try again.");
    }
    throw error;
  }
};

export const getNetworkInfo = async () => {
  if (!window.ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    const networkNames = {
      1: { name: "Ethereum Mainnet", explorer: "https://etherscan.io" },
      11155111: {
        name: "Sepolia Testnet",
        explorer: "https://sepolia.etherscan.io",
      },
      5: { name: "Goerli Testnet", explorer: "https://goerli.etherscan.io" },
      137: { name: "Polygon Mainnet", explorer: "https://polygonscan.com" },
      80001: {
        name: "Mumbai Testnet",
        explorer: "https://mumbai.polygonscan.com",
      },
      31337: { name: "Hardhat Local", explorer: null },
    };

    const chainId = Number(network.chainId);
    const info = networkNames[chainId] || {
      name: `Unknown (${chainId})`,
      explorer: null,
    };

    return {
      chainId,
      name: info.name,
      explorer: info.explorer,
    };
  } catch (error) {
    console.error("Error getting network info:", error);
    return null;
  }
};

export const getWalletAddress = async () => {
  if (!window.ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    // Handle pending request error
    if (error.code === -32002) {
      toast.error("Connection request already pending. Please check MetaMask.");
      console.log("Connection request already pending. Please check MetaMask.");
      return null;
    } else if (error.code === 4001) {
      toast.error("Connection rejected by user.");
      console.log("Connection rejected by user.");
      return null;
    }
    console.error("Error getting wallet address:", error);
    return null;
  }
};

export const getExplorerUrl = (type, hash, explorer) => {
  if (!explorer) return null;
  const paths = {
    tx: "tx",
    address: "address",
    block: "block",
  };
  return `${explorer}/${paths[type]}/${hash}`;
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    toast.error("MetaMask not installed. Please install it to continue.");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts && accounts.length > 0) {
      toast.success(
        `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      );
      return accounts[0];
    }
  } catch (error) {
    if (error.code === 4001) {
      toast.error("Connection rejected by user");
    } else if (error.code === -32002) {
      toast.error("Connection request pending. Check MetaMask.");
    } else {
      toast.error("Failed to connect wallet");
      console.error("Wallet connection error:", error);
    }
    return null;
  }
};

export const disconnectWallet = async () => {
  try {
    // Note: MetaMask doesn't have a built-in disconnect,
    // but we can clear the connection by removing event listeners
    // and resetting the app state
    toast.success("Wallet disconnected");
    return true;
  } catch (error) {
    toast.error("Error disconnecting wallet");
    console.error("Disconnection error:", error);
    return false;
  }
};

export { contractAddress };
