import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function registerProperty(uint,string,uint)",
  "function transferProperty(uint,address)",
  "function getProperty(uint) view returns(uint,string,uint,address)"
];

export const getContract = async () => {

  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    signer   // IMPORTANT: signer not provider
  );

  return contract;
};