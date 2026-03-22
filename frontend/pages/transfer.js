import { useState } from "react";
import Navbar from "../components/Navbar";
import { getContract } from "../utils/contract";

export default function Transfer() {
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const transfer = async () => {
    if (!id || !address) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Invalid Ethereum address format");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const contract = await getContract();
      await contract.transferProperty(id, address);

      setSuccess(true);
      setId("");
      setAddress("");

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || "Failed to transfer property");
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

            {success && (
              <div className="alert alert-success">
                ✓ Property transferred successfully!
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
              </div>

              <button
                onClick={transfer}
                className="btn btn-secondary btn-block"
                disabled={loading}
              >
                {loading ? "Transferring..." : "Transfer Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}