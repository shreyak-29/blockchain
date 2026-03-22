import Link from "next/link";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { getNetworkInfo, contractAddress } from "../utils/contract";

export default function Home() {
  const [network, setNetwork] = useState(null);

  const loadNetwork = async () => {
    const netInfo = await getNetworkInfo();
    setNetwork(netInfo);
  };
 
  useEffect(() => {
    loadNetwork();
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="hero">
          <h1>🏘️ Blockchain Real Estate Registry</h1>
          <p>
            Secure, transparent property ownership management using Web3 technology
          </p>
          {network && (
            <div style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.9 }}>
              Connected to: <strong>{network.name}</strong>
              {network.chainId === 31337 && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                  ⚠️ Local Development Network - For testing only
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3>📋 Register Property</h3>
            </div>
            <div className="card-body">
              <p>
                Add your property to the blockchain registry. Create an immutable
                record of your real estate assets.
              </p>
              <Link href="/register" className="btn btn-primary btn-block">
                Register Property →
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>🔄 Transfer Property</h3>
            </div>
            <div className="card-body">
              <p>
                Transfer ownership of your property to another address on the
                blockchain. Fast and secure transactions.
              </p>
              <Link href="/transfer" className="btn btn-secondary btn-block">
                Transfer Property →
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>🔍 Verify Property</h3>
            </div>
            <div className="card-body">
              <p>
                Search and verify property information on the blockchain. Check
                ownership, location, and valuation details.
              </p>
              <Link href="/view" className="btn btn-accent btn-block">
                Verify Property →
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>🔐 Web3 Enabled</h3>
            </div>
            <div className="card-body">
              <p>
                Connect your wallet to securely manage your properties using
                blockchain technology. Your data, your control.
              </p>
              <div style={{ fontSize: "0.75rem", marginTop: "1rem", color: "#666" }}>
                <strong>Contract:</strong><br />
                <code style={{ fontSize: "0.7rem", wordBreak: "break-all" }}>
                  {contractAddress}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "2rem" }}>
          <div className="card-header">
            <h3>ℹ️ How It Works</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <strong>1. Connect Wallet</strong> - Use MetaMask to connect your Ethereum wallet
              </div>
              <div>
                <strong>2. Register Property</strong> - Add property details (ID, location, price) to the blockchain
              </div>
              <div>
                <strong>3. View on Blockchain</strong> - All transactions are recorded permanently and transparently
              </div>
              <div>
                <strong>4. Transfer Ownership</strong> - Securely transfer property to new owners with blockchain verification
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}