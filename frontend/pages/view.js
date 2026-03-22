import { useState } from "react";
import Navbar from "../components/Navbar";
import { getContract } from "../utils/contract";

export default function View() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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

      const contract = await getContract();
      const property = await contract.getProperty(id);

      setData(property);
      setSearched(true);
    } catch (err) {
      setError(err.message || "Property not found");
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

            {error && (
              <div className="alert alert-error">
                ✗ {error}
              </div>
            )}

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
                {loading ? "Searching..." : "Search Property"}
              </button>
            </div>
          </div>

          {searched && data && (
            <div className="card" style={{ marginTop: "24px" }}>
              <div className="card-header">
                <h3>Property Details</h3>
              </div>
              <div className="property-card">
                <div className="property-item">
                  <span className="property-label">Property ID:</span>
                  <span className="property-value">{data[0]?.toString()}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Location:</span>
                  <span className="property-value">{data[1]}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Price (Wei):</span>
                  <span className="property-value">{data[2]?.toString()}</span>
                </div>
                <div className="property-item">
                  <span className="property-label">Owner Address:</span>
                  <span className="property-value">{data[3]}</span>
                </div>
              </div>
            </div>
          )}

          {searched && !data && !error && (
            <div className="card" style={{ marginTop: "24px" }}>
              <div className="alert alert-info">
                ℹ️ No results found for the given property ID
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}