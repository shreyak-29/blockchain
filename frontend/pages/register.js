import { ethers } from "ethers";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import Navbar from "../components/Navbar";
import { getContract, getExplorerUrl, getNetworkInfo } from "../utils/contract";

// Fix leaflet marker icons
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Function to create colored markers based on transfer count
// Red = new property, transitions to blue as transfers increase
const getMarkerIconByTransfers = (transferCount) => {
  const colors = [
    "red",      // 0 transfers
    "orange",   // 1 transfer
    "yellow",   // 2 transfers
    "grey",     // 3 transfers
    "violet",   // 4+ transfers
    "blue",     // 5+ transfers
  ];
  const colorIndex = Math.min(transferCount, colors.length - 1);
  const color = colors[colorIndex];

  const iconUrls = {
    red: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    orange: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    yellow: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
    grey: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    violet: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    blue: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  };

  return L.icon({
    iconUrl: iconUrls[color],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Map click handler and ref component
const MapController = ({ onMapClick, mapRef }) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;

    map.on("click", (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.off("click");
    };
  }, [map, onMapClick, mapRef]);

  return null;
};

// No longer needed - using leaflet markers instead

export default function Register() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState(40.7128);
  const [lng, setLng] = useState(-74.006);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txData, setTxData] = useState(null);
  const [registeredProperties, setRegisteredProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const mapRef = useRef(null);

  // Get next property ID on mount
  useEffect(() => {
    const getNextId = async () => {
      try {
        const contract = await getContract();
        const nextId = await contract.getNextPropertyId();
        setPropertyId(nextId.toString());
      } catch (err) {
        console.error("Error getting next property ID:", err);
      }
    };
    getNextId();
    loadRegisteredProperties();
  }, []);

  // Load registered properties
  const loadRegisteredProperties = async () => {
    try {
      setLoadingProperties(true);
      const contract = await getContract();
      const props = await contract.getAllProperties(1, 100);
      setRegisteredProperties(props);
    } catch (err) {
      console.error("Error loading properties:", err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const copyPropertyId = () => {
    navigator.clipboard.writeText(propertyId);
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  const searchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Use Nominatim (OpenStreetMap) free geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);

        setLat(newLat);
        setLng(newLng);
        setLocation(searchQuery);
        setSearchQuery("");

        // Pan map to the searched location
        if (mapRef.current) {
          mapRef.current.setView([newLat, newLng], 13);
        }
      } else {
        setError("Location not found. Try a different search.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleMapClick = (lat, lng) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
  };

  const register = async () => {
    if (!propertyName || !location || !price || selectedLat === null) {
      setError("Please fill in all fields and select a location on the map");
      return;
    }

    if (isNaN(price) || Number(price) < 0) {
      setError("Price must be a valid positive number");
      return;
    }

    // Check if location is too close to existing properties
    for (const prop of registeredProperties) {
      const propLat = Number(prop.latitude) / 1e6;
      const propLng = Number(prop.longitude) / 1e6;
      const distance = Math.sqrt(
        Math.pow(selectedLat - propLat, 2) + Math.pow(selectedLng - propLng, 2),
      );
      if (distance < 0.001) {
        // ~100 meters
        setError("⚠️ A property already exists at this location!");
        return;
      }
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);
      setTxData(null);

      const netInfo = await getNetworkInfo();
      const contract = await getContract();

      // Convert lat/lng to fixed point integers (multiply by 1e6)
      const latFixed = Math.floor(selectedLat * 1e6);
      const lngFixed = Math.floor(selectedLng * 1e6);

      const tx = await contract.registerProperty(
        propertyName,
        location,
        ethers.parseEther(price),
        latFixed,
        lngFixed,
      );

      const receipt = await tx.wait();

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
        status: receipt.status === 1 ? "Success" : "Failed",
        propertyId: propertyId,
      });

      setSuccess(true);
      setPropertyName("");
      setLocation("");
      setPrice("");
      setSelectedLat(null);
      setSelectedLng(null);

      // Reload properties and get new ID
      await loadRegisteredProperties();
      const nextId = await contract.getNextPropertyId();
      setPropertyId(nextId.toString());
    } catch (err) {
      console.error("Registration error:", err);

      if (err.message.includes("user rejected")) {
        setError("Transaction rejected by user");
      } else if (err.message.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees");
      } else if (err.message.includes("network")) {
        setError("Network error. Please check your connection");
      } else {
        setError(err.message || "Failed to register property");
      }
    } finally {
      setLoading(false);
    }
  };

  const convertPriceToEth = (weiValue) => {
    try {
      return ethers.formatEther(weiValue);
    } catch {
      return "N/A";
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
              <p>Add your property to the blockchain registry with location</p>
            </div>

            {success && txData && (
              <div className="alert alert-success">
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    ✓ Property Registered Successfully!
                  </div>

                  <div className="tx-details-grid">
                    <div className="tx-detail-item">
                      <span className="tx-detail-label">🏠 Property ID:</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">
                          {txData.propertyId}
                        </code>
                        <button
                          onClick={copyPropertyId}
                          className="copy-btn"
                          style={{
                            padding: "5px 10px",
                            marginLeft: "10px",
                            fontSize: "12px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {idCopied ? "✓ Copied!" : "📋 Copy ID"}
                        </button>
                      </div>
                    </div>

                    <div className="tx-detail-item">
                      <span className="tx-detail-label">
                        📝 Transaction Hash:
                      </span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">{txData.hash}</code>
                        {txData.network?.explorer && (
                          <a
                            href={getExplorerUrl(
                              "tx",
                              txData.hash,
                              txData.network.explorer,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="explorer-btn"
                          >
                            View on Etherscan 🔗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="tx-detail-item">
                      <span className="tx-detail-label">📦 Block Number:</span>
                      <div className="tx-detail-value">
                        <code className="tx-hash-code">
                          {txData.blockNumber}
                        </code>
                      </div>
                    </div>

                    <div className="tx-stats">
                      <div className="tx-stat">
                        <span className="stat-label">⛽ Gas Used:</span>
                        <span className="stat-value">
                          {Number(txData.gasUsed).toLocaleString()}
                        </span>
                      </div>
                      <div className="tx-stat">
                        <span className="stat-label">💰 Gas Price:</span>
                        <span className="stat-value">
                          {parseFloat(txData.gasPrice).toFixed(2)} Gwei
                        </span>
                      </div>
                      <div className="tx-stat">
                        <span className="stat-label">💸 Total Gas Fees:</span>
                        <span className="stat-value">
                          {parseFloat(txData.gasFees).toFixed(6)} ETH
                        </span>
                      </div>
                      <div className="tx-stat">
                        <span className="stat-label">✅ Status:</span>
                        <span className="stat-value status-success">
                          {txData.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="alert alert-error">✗ {error}</div>}

            <div className="card-body">
              <div className="form-group">
                <label htmlFor="property-name">🏘️ Property Name</label>
                <input
                  id="property-name"
                  type="text"
                  placeholder="e.g., Downtown Penthouse, Cozy Apartment"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="property-id">
                  🆔 Property ID
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#888",
                      marginLeft: "5px",
                    }}
                  >
                    (Auto-generated)
                  </span>
                </label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <input
                    id="property-id"
                    type="text"
                    value={propertyId}
                    disabled={true}
                    style={{
                      flex: 1,
                      backgroundColor: "#f0f0f0",
                      cursor: "not-allowed",
                    }}
                  />
                  <button
                    onClick={copyPropertyId}
                    className="btn btn-secondary"
                    style={{ padding: "10px 15px" }}
                  >
                    {idCopied ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
                <small className="form-hint">
                  💡 Save this ID - you&apos;ll need it for transfers and
                  verification
                </small>
              </div>

              <div className="form-group">
                <label>
                  � Search Location (e.g., "Thane, Mumbai")
                </label>
                <form onSubmit={searchLocation} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="Enter city, area, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={searching}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={searching || !searchQuery.trim()}
                    style={{ padding: "10px 20px" }}
                  >
                    {searching ? "🔍 Searching..." : "🔍 Search"}
                  </button>
                </form>
              </div>

              <div className="form-group">
                <label>
                  📍 Select Location on Map (Click on map to select)
                </label>
                <div
                  style={{
                    height: "400px",
                    width: "100%",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "2px solid #333",
                  }}
                >
                  <MapContainer
                    center={[lat, lng]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController onMapClick={handleMapClick} mapRef={mapRef} />

                    {/* Show your selected property */}
                    {selectedLat && (
                      <Marker position={[selectedLat, selectedLng]} icon={greenIcon}>
                        <Popup>
                          <div style={{ fontSize: "13px" }}>
                            <strong>📍 Your Property</strong>
                            <br />
                            Lat: {selectedLat.toFixed(4)}°<br />
                            Lng: {selectedLng.toFixed(4)}°
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Show registered properties with color-coded transfer count */}
                    {registeredProperties.map((prop, idx) => {
                      const transferCount = Number(prop.transferCount || 0);
                      const markerIcon = getMarkerIconByTransfers(transferCount);
                      
                      const transferStatus = 
                        transferCount === 0 ? "🆕 New Property" :
                        transferCount === 1 ? "📦 1 Transfer" :
                        `📦 ${transferCount} Transfers`;

                      return (
                        <Marker
                          key={idx}
                          position={[Number(prop.latitude) / 1e6, Number(prop.longitude) / 1e6]}
                          icon={markerIcon}
                        >
                          <Popup>
                            <div style={{ fontSize: "12px" }}>
                              <strong>{prop.name}</strong>
                              <br />
                              ID: {prop.id.toString()}
                              <br />
                              {transferStatus}
                              <br />
                              Lat: {(Number(prop.latitude) / 1e6).toFixed(4)}°<br />
                              Lng: {(Number(prop.longitude) / 1e6).toFixed(4)}°<br />
                              💰 {convertPriceToEth(prop.price)} ETH
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
                {selectedLat && (
                  <small className="form-hint" style={{ color: "#4CAF50" }}>
                    ✓ Location selected: {location}
                  </small>
                )}
                <small className="form-hint" style={{ marginTop: "8px" }}>
                  💡 Legend: 🟥 Red=New | 🟧 Orange=1 Transfer | 🟨 Yellow=2 | ⚪ Grey=3 | 🟣 Violet=4+ | 🔵 Blue=5+ Transfers
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="price">💰 Price (in ETH)</label>
                <input
                  id="price"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 1.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                />
                <small className="form-hint">
                  💡 Enter amount in ETH (will be converted to Wei)
                </small>
              </div>

              <button
                onClick={register}
                className="btn btn-primary btn-block"
                disabled={loading || selectedLat === null}
              >
                {loading
                  ? "⏳ Processing Transaction..."
                  : "🚀 Register Property"}
              </button>
            </div>

            {/* Registered Properties Summary */}
            {registeredProperties.length > 0 && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <h4>
                  📌 Nearby Registered Properties ({registeredProperties.length}
                  )
                </h4>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {registeredProperties.map((prop, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "10px",
                        marginBottom: "10px",
                        backgroundColor: "white",
                        borderLeft: "4px solid #FF5252",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                      }}
                    >
                      <div>
                        <strong>{prop.name}</strong> (ID: {prop.id.toString()})
                      </div>
                      <div style={{ color: "#666" }}>
                        📍 {(Number(prop.latitude) / 1e6).toFixed(4)}°,{" "}
                        {(Number(prop.longitude) / 1e6).toFixed(4)}°
                      </div>
                      <div style={{ color: "#666" }}>
                        💰 {convertPriceToEth(prop.price)} ETH
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
