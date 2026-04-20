import { ethers } from "ethers";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { getContract, getExplorerUrl, getNetworkInfo } from "../utils/contract";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// MapController component - must be dynamic to use useMap hook
const MapController = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;
      return function MapControllerComponent({ onMapClick, mapRef }) {
        const map = useMap();

        useEffect(() => {
          if (map && mapRef) {
            mapRef.current = map;
            map.on("click", (e) => {
              onMapClick(e.latlng.lat, e.latlng.lng);
            });

            return () => {
              map.off("click");
            };
          }
        }, [map, onMapClick, mapRef]);

        return null;
      };
    }),
  { ssr: false },
);

let L;
let greenIcon;
let getMarkerIconByTransfers;

// Initialize Leaflet only on client side
if (typeof window !== "undefined") {
  L = require("leaflet");

  greenIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  getMarkerIconByTransfers = (transferCount) => {
    const colors = ["red", "orange", "yellow", "grey", "violet", "blue"];
    const colorIndex = Math.min(transferCount, colors.length - 1);
    const color = colors[colorIndex];

    const iconUrls = {
      red: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      orange:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      yellow:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
      grey: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
      violet:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
      blue: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    };

    return L.icon({
      iconUrl: iconUrls[color],
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };
}

export default function Register() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState(20.5937); // India center
  const [lng, setLng] = useState(78.9629);
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
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationName, setLocationName] = useState("");
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

  // Get autocomplete suggestions as user types
  const handleSearchInput = async (value) => {
    setSearchQuery(value);
    setShowSuggestions(true);

    if (value.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          value,
        )}&format=json&limit=10&countrycodes=in`,
      );
      const data = await response.json();
      setSearchSuggestions(data || []);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSearchSuggestions([]);
    }
  };

  // Select a suggestion from dropdown
  const selectSuggestion = async (suggestion) => {
    const newLat = parseFloat(suggestion.lat);
    const newLng = parseFloat(suggestion.lon);

    setLat(newLat);
    setLng(newLng);
    setLocationName(suggestion.display_name || suggestion.name);
    setSearchQuery(suggestion.display_name || suggestion.name);
    setShowSuggestions(false);
    setSearchSuggestions([]);

    // Pan map to the searched location
    if (mapRef.current) {
      mapRef.current.setView([newLat, newLng], 13);
    }
  };

  // Reverse geocoding - get location name from coordinates
  const getReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = await response.json();
      return (
        data.address?.road ||
        data.address?.village ||
        data.address?.city ||
        data.display_name ||
        ""
      );
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      return "";
    }
  };

  const handleMapClick = async (mapLat, mapLng) => {
    setSelectedLat(mapLat);
    setSelectedLng(mapLng);

    // Get location name from reverse geocoding
    const locName = await getReverseGeocode(mapLat, mapLng);
    const displayText = locName
      ? `${locName} (${mapLat.toFixed(4)}°, ${mapLng.toFixed(4)}°)`
      : `Lat: ${mapLat.toFixed(4)}, Lng: ${mapLng.toFixed(4)}`;

    setLocation(displayText);
  };

  const register = async () => {
    if (!propertyName || !location || !price || selectedLat === null) {
      setError("Please fill in all fields and select a location on the map");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setError("Price must be greater than 0 ETH");
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
                <label>📍 Select Location - Search or Click on Map</label>

                {/* In-map integrated search box with autocomplete */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: "10px",
                    zIndex: 1000,
                  }}
                >
                  <div style={{ flex: 1, position: "relative" }}>
                    <input
                      type="text"
                      placeholder="🔍 Search: Mumbai, Thane, Kalyan, Dhamankar Naka, etc..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => searchQuery && setShowSuggestions(true)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "2px solid #333",
                        backgroundColor: "#0f1419",
                        color: "#fff",
                        marginBottom: "8px",
                      }}
                    />
                    {/* Autocomplete suggestions dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          backgroundColor: "#0f1419",
                          border: "2px solid #333",
                          borderTop: "none",
                          maxHeight: "250px",
                          overflowY: "auto",
                          zIndex: 1001,
                          borderRadius: "0 0 4px 4px",
                        }}
                      >
                        {searchSuggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            onClick={() => selectSuggestion(suggestion)}
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #333",
                              cursor: "pointer",
                              backgroundColor: "#0f1419",
                              color: "#4CAF50",
                              fontSize: "13px",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#1a1e2e";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "#0f1419";
                            }}
                          >
                            {suggestion.name || suggestion.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                    <MapController
                      onMapClick={handleMapClick}
                      mapRef={mapRef}
                    />

                    {/* Show your selected property */}
                    {selectedLat && (
                      <Marker
                        position={[selectedLat, selectedLng]}
                        icon={greenIcon}
                      >
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
                      const markerIcon =
                        getMarkerIconByTransfers(transferCount);

                      const transferStatus =
                        transferCount === 0
                          ? "🆕 New Property"
                          : transferCount === 1
                          ? "📦 1 Transfer"
                          : `📦 ${transferCount} Transfers`;

                      return (
                        <Marker
                          key={idx}
                          position={[
                            Number(prop.latitude) / 1e6,
                            Number(prop.longitude) / 1e6,
                          ]}
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
                              Lat: {(Number(prop.latitude) / 1e6).toFixed(4)}°
                              <br />
                              Lng: {(Number(prop.longitude) / 1e6).toFixed(4)}°
                              <br />
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
                  💡 <strong>Legend:</strong> 🟥 Red=New | 🟧 Orange=1 | 🟨
                  Yellow=2 | ⚪ Grey=3 | 🟣 Violet=4+ | 🔵 Blue=5+ Transfers
                </small>
                <small className="form-hint" style={{ marginTop: "5px" }}>
                  <strong>How to select location:</strong> Type location name in
                  search box OR click on map directly
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="price">💰 Price in ETH</label>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    id="price"
                    type="number"
                    step="0.001"
                    min="0.001"
                    placeholder="e.g., 1.5 ETH"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: "#888", fontWeight: "bold" }}>ETH</span>
                </div>
                <small className="form-hint" style={{ marginTop: "5px" }}>
                  💡 Must be greater than 0 ETH
                </small>
              </div>

              <button
                onClick={register}
                className="btn btn-primary btn-block"
                disabled={loading}
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
