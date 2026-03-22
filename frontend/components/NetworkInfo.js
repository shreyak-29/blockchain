import { useState, useEffect } from "react";
import { getNetworkInfo, getWalletAddress, contractAddress, getExplorerUrl } from "../utils/contract";

export default function NetworkInfo() {
  const [network, setNetwork] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const netInfo = await getNetworkInfo();
        const walletAddr = await getWalletAddress();
        
        if (netInfo && walletAddr) {
          setNetwork(netInfo);
          setWallet(walletAddr);
          setError(false);
        }
      } catch (err) {
        console.error("Error loading network info:", err);
        setError(true);
      }
    };

    loadInfo();
    
    if (window.ethereum) {
      window.ethereum.on("chainChanged", loadInfo);
      window.ethereum.on("accountsChanged", loadInfo);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", loadInfo);
        window.ethereum.removeListener("accountsChanged", loadInfo);
      }
    };
  }, []);

  if (error || !network || !wallet) return null;

  return (
    <div className="network-info">
      <div className="network-badge">
        <span className="badge-label">Network:</span>
        <span className="badge-value">{network.name}</span>
      </div>
      
      <div className="network-badge">
        <span className="badge-label">Wallet:</span>
        <span className="badge-value">
          {wallet.slice(0, 6)}...{wallet.slice(-4)}
        </span>
        {network.explorer && (
          <a 
            href={getExplorerUrl("address", wallet, network.explorer)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="explorer-link"
          >
            🔗
          </a>
        )}
      </div>
      
      <div className="network-badge">
        <span className="badge-label">Contract:</span>
        <span className="badge-value">
          {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
        </span>
        {network.explorer && (
          <a 
            href={getExplorerUrl("address", contractAddress, network.explorer)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="explorer-link"
          >
            🔗
          </a>
        )}
      </div>
    </div>
  );
}
