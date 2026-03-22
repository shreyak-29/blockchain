import { useState } from "react";
import Navbar from "../components/Navbar";
import { getContract } from "../utils/contract";

export default function Register() {
  const [id, setId] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    if (!id || !location || !price) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const contract = await getContract();
      await contract.registerProperty(id, location, price);

      setSuccess(true);
      setId("");
      setLocation("");
      setPrice("");

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || "Failed to register property");
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

            {success && (
              <div className="alert alert-success">
                ✓ Property registered successfully!
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
              </div>

              <button
                onClick={register}
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}