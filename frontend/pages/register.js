import { useState } from "react";
import Navbar from "../components/Navbar";
import { getContract, getNetworkInfo, getExplorerUrl } from "../utils/contract";
import { ethers } from "ethers";

export default function Register() {
  const [id, setId] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txData, setTxData] = useState(null);

  const register = async () => {
    if (!id || !location || !price) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(id) || Number(id) < 0) {
      setError("Property ID must be a valid positive number");
      return;
    }

    if (isNaN(price) || Number(price) < 0) {
      setError("Price must be a valid positive number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);
      setTxData(null);

      const netInfo = await getNetworkInfo();
      const contract = await getContract();
      
      const tx = await contract.registerProperty(id, location, price);
      
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
        status: receipt.status === 1 ? "Success" : "Failed"
      });

      setSuccess(true);
      setId("");
      setLocation("");
      setPrice("");

    } catch (err) {
      console.error("Registration error:", err);
      
      // Better error messages
      if (err.message.includes("user rejected")) {
        setError("Transaction rejected by user");
      } else if (err.message.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees");
      } else if (err.message.includes("network")) {
        setError("Network error. Please check your connection");
      } else if (err.message.includes("nonce")) {
        setError("Transaction error. Please try again");
      } else {
        setError(err.message || "Failed to register property");
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
              <h2>📋 Register Property</h2>
              <p>Add your property to the blockchain registry</p>
            </div>

            {success && txData && (
              <div className="alert alert-success">
                <div style={{ width: "100%" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    ✓ Property Registered Successfully!
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
                      <span className="tx-detail-label">👤 From:</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">{txData.from}</code>
                        {txData.network?.explorer && (
                          <a 
                            href={getExplorerUrl("address", txData.from, txData.network.explorer)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="explorer-btn"
                          >
                            View Address 🔗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="tx-detail-item">
                      <span className="tx-detail-label">📍 To (Contract):</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">{txData.to}</code>
                        {txData.network?.explorer && (
                          <a 
                            href={getExplorerUrl("address", txData.to, txData.network.explorer)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="explorer-btn"
                          >
                            View Contract 🔗
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
                  placeholder="Enter unique property identifier"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g., 123 Main Street, New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (in Wei)</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Enter property value in Wei"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                />
                <small className="form-hint">
                  💡 1 ETH = 1,000,000,000,000,000,000 Wei
                </small>
              </div>

              <button
                onClick={register}
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "⏳ Processing Transaction..." : "Register Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
