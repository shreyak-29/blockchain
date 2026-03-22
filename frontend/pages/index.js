import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="hero">
          <h1>🏘️ Blockchain Real Estate Registry</h1>
          <p>
            Secure, transparent property ownership management using Web3 technology
          </p>
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
              <button className="btn btn-primary btn-block" disabled>
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}