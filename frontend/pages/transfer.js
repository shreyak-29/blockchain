import { useState } from "react";
import Navbar from "../components/Navbar";
import { getContract, getNetworkInfo, getExplorerUrl } from "../utils/contract";
import { ethers } from "ethers";

export default function Transfer() {
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txData, setTxData] = useState(null);

  const transfer = async () => {
    if (!id || !address) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Invalid Ethereum address format. Must start with 0x and be 42 characters long");
      return;
    }

    if (isNaN(id) || Number(id) < 0) {
      setError("Property ID must be a valid positive number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);
      setTxData(null);

      const netInfo = await getNetworkInfo();
      const contract = await getContract();
      
      const tx = await contract.transferProperty(id, address);
      
      const receipt = await tx.wait();
      
      // Calculate gas fees
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const gasFees = gasUsed * gasPrice;
      const gasFeeInEth = ethers.formatEther(gasFees);

      setTxData({
        hash: receipt.hash,
        blockNumber: receipt.blockNumber.toString(),
        from: receipt.from,
        to: receipt.to,
        gasUsed: gasUsed.toString(),
        gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        gasFees: gasFeeInEth,
        network: netInfo,
        newOwner: address,
        status: receipt.status === 1 ? "Success" : "Failed"
      });

      setSuccess(true);
      setId("");
      setAddress("");

    } catch (err) {
      console.error("Transfer error:", err);
      
      // Better error messages
      if (err.message.includes("Not owner")) {
        setError("You are not the owner of this property. Only the owner can transfer it.");
      } else if (err.message.includes("user rejected")) {
        setError("Transaction rejected by user");
      } else if (err.message.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees");
      } else if (err.message.includes("network")) {
        setError("Network error. Please check your connection");
      } else if (err.message.includes("nonce")) {
        setError("Transaction error. Please try again");
      } else {
        setError(err.message || "Failed to transfer property. Make sure you own this property.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="centered-card">
          <div className="card">
            <div className="card-header">
              <h2>🔄 Transfer Property</h2>
              <p>Transfer property ownership to a new address</p>
            </div>

            {success && txData && (
              <div className="alert alert-success">
                <div style={{ width: "100%" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    ✓ Property Transferred Successfully!
                  </div>
                  
                  <div className="tx-details-grid">
                    <div className="tx-detail-item">
                      <span className="tx-detail-label">📝 Transaction Hash:</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">{txData.hash}</code>
                        {txData.network?.explorer && (
                          <a 
                            href={getExplorerUrl("tx", txData.hash, txData.network.explorer)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="explorer-btn"
                          >
                            View on {txData.network.explorer.includes('etherscan') ? 'Etherscan' : 'Explorer'} 🔗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="tx-detail-item">
                      <span className="tx-detail-label">📦 Block Number:</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">{txData.blockNumber}</code>
                        {txData.network?.explorer && (
                          <a 
                            href={getExplorerUrl("block", txData.blockNumber, txData.network.explorer)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="explorer-btn"
                          >
                            View Block 🔗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="tx-detail-item">
                      <span className="tx-detail-label">🎯 New Owner:</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">{txData.newOwner}</code>
                        {txData.network?.explorer && (
                          <a 
                            href={getExplorerUrl("address", txData.newOwner, txData.network.explorer)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="explorer-btn"
                          >
                            View Address 🔗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="tx-stats">
                      <div className="tx-stat">
                        <span className="stat-label">⛽ Gas Used:</span>
                        <span className="stat-value">{Number(txData.gasUsed).toLocaleString()}</span>
                      </div>
                      <div className="tx-stat">
                        <span className="stat-label">💰 Gas Price:</span>
                        <span className="stat-value">{parseFloat(txData.gasPrice).toFixed(2)} Gwei</span>
                      </div>
                      <div className="tx-stat">
                        <span className="stat-label">💸 Total Gas Fees:</span>
                        <span className="stat-value">{parseFloat(txData.gasFees).toFixed(6)} ETH</span>
                      </div>
                      <div className="tx-stat">
                        <span className="stat-label">✅ Status:</span>
                        <span className="stat-value status-success">{txData.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                ✗ {error}
              </div>
            )}

            <div className="card-body">
              <div className="form-group">
                <label htmlFor="property-id">Property ID</label>
                <input
                  id="property-id"
                  type="number"
                  placeholder="Enter property ID to transfer"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-owner">New Owner Address</label>
                <input
                  id="new-owner"
                  type="text"
                  placeholder="0x... (Ethereum address)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                />
                <small className="form-hint">
                  💡 Must be a valid Ethereum address (42 characters starting with 0x)
                </small>
              </div>

              <button
                onClick={transfer}
                className="btn btn-secondary btn-block"
                disabled={loading}
              >
                {loading ? "⏳ Processing Transaction..." : "Transfer Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
