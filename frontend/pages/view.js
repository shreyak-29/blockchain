import { ethers } from "ethers";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { getContract, getExplorerUrl, getNetworkInfo } from "../utils/contract";

export default function View() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [network, setNetwork] = useState(null);

  const search = async () => {
    if (!id) {
      setError("Please enter a property ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setData(null);
      setSearched(false);

      const netInfo = await getNetworkInfo();
      setNetwork(netInfo);

      const contract = await getContract();

      // Call getProperty with proper type conversion
      const result = await contract.getProperty(BigInt(id));

      // Check if property exists (owner address is not zero address)
      if (result[4] === "0x0000000000000000000000000000000000000000") {
        setError("Property not found. Please register this property first.");
        setSearched(true);
        return;
      }

      // Convert result to proper format
      // Result: [id, name, location, price, owner, latitude, longitude, transferCount]
      const propertyData = {
        id: result[0].toString(),
        name: result[1],
        location: result[2],
        price: result[3],
        owner: result[4],
        latitude: result[5],
        longitude: result[6],
        transferCount: result[7].toString(),
      };

      setData(propertyData);
      setSearched(true);
    } catch (err) {
      console.error("Error fetching property:", err);

      // Better error messages
      if (err.message.includes("could not decode")) {
        setError("Property not found. Please register this property first.");
      } else if (err.message.includes("user rejected")) {
        setError("Transaction rejected by user.");
      } else if (err.message.includes("network")) {
        setError("Network error. Please check your connection.");
      } else {
        setError(
          "Property not found or does not exist. Please register it first.",
        );
      }

      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const formatPrice = (weiValue) => {
    try {
      const eth = ethers.formatEther(weiValue);
      return `${parseFloat(eth).toFixed(4)} ETH (${weiValue.toString()} Wei)`;
    } catch {
      return `${weiValue.toString()} Wei`;
    }
  };

  const formatCoordinates = (coord) => {
    // Coordinates are stored as fixed point (multiply by 1e6)
    return (Number(coord) / 1e6).toFixed(6);
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="centered-card">
          <div className="card">
            <div className="card-header">
              <h2>🔍 Verify Property</h2>
              <p>Search and view property information on the blockchain</p>
            </div>

            {error && <div className="alert alert-error">✗ {error}</div>}

            <div className="card-body">
              <div className="form-group">
                <label htmlFor="search-id">Property ID</label>
                <input
                  id="search-id"
                  type="number"
                  placeholder="Enter property ID to search"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              <button
                onClick={search}
                className="btn btn-accent btn-block"
                disabled={loading}
              >
                {loading ? "⏳ Searching..." : "🔍 Search Property"}
              </button>
            </div>
          </div>

          {searched && data && (
            <div className="card" style={{ marginTop: "24px" }}>
              <div className="card-header">
                <h3>✅ Property Found</h3>
              </div>
              <div className="property-card">
                <div className="property-item">
                  <span className="property-label">🆔 Property ID:</span>
                  <span className="property-value">{data.id}</span>
                </div>

                <div className="property-item">
                  <span className="property-label">🏠 Property Name:</span>
                  <span
                    className="property-value"
                    style={{ fontWeight: "bold" }}
                  >
                    {data.name}
                  </span>
                </div>

                <div className="property-item">
                  <span className="property-label">📍 Location:</span>
                  <span className="property-value">{data.location}</span>
                </div>

                <div className="property-item">
                  <span className="property-label">🌍 Coordinates:</span>
                  <div
                    className="property-value"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <div>Latitude: {formatCoordinates(data.latitude)}°</div>
                    <div>Longitude: {formatCoordinates(data.longitude)}°</div>
                  </div>
                </div>

                <div className="property-item">
                  <span className="property-label">💰 Price:</span>
                  <span className="property-value">
                    {formatPrice(data.price)}
                  </span>
                </div>

                <div className="property-item">
                  <span className="property-label">� Transfer History:</span>
                  <span className="property-value">
                    {data.transferCount === "0"
                      ? "🆕 New Property (Never Transferred)"
                      : data.transferCount === "1"
                      ? "📦 1 Transfer"
                      : `📦 ${data.transferCount} Transfers`}
                  </span>
                </div>

                <div className="property-item">
                  <span className="property-label">�👤 Owner Address:</span>
                  <div className="owner-address">
                    <code
                      className="property-value"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {data.owner}
                    </code>
                    {network?.explorer && (
                      <a
                        href={getExplorerUrl(
                          "address",
                          data.owner,
                          network.explorer,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link"
                      >
                        View on Explorer 🔗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
