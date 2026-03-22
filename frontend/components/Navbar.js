import Link from "next/link";
import { useEffect, useState } from "react";
import {
  connectWallet,
  disconnectWallet,
  getWalletAddress,
} from "../utils/contract";
import NetworkInfo from "./NetworkInfo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if wallet is already connected
    checkWalletConnection();

    // Listen for wallet changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", checkWalletConnection);
      window.ethereum.on("chainChanged", checkWalletConnection);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          checkWalletConnection,
        );
        window.ethereum.removeListener("chainChanged", checkWalletConnection);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await getWalletAddress();
      if (address) {
        setWalletConnected(true);
        setWalletAddress(address);
      } else {
        setWalletConnected(false);
        setWalletAddress(null);
      }
    } catch (error) {
      setWalletConnected(false);
      setWalletAddress(null);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWalletConnected(true);
        setWalletAddress(address);
        setMobileMenuOpen(false);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(true);
    try {
      const result = await disconnectWallet();
      if (result) {
        setWalletConnected(false);
        setWalletAddress(null);
        setMobileMenuOpen(false);
      }
    } catch (error) {
      console.error("Disconnection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Register", href: "/register" },
    { label: "Transfer", href: "/transfer" },
    { label: "Verify", href: "/view" },
  ];

  if (!mounted) return null;

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-main">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">BlockRegistry</span>
          </Link>
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <div className="navbar-middle">
          <ul className="navbar-links-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="navbar-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Info & Actions */}
        <div className="navbar-right-group">
          <div className="navbar-info">
            <NetworkInfo />
          </div>

          {/* Wallet Button */}
          <button
            className={`wallet-button ${
              walletConnected ? "connected" : "disconnected"
            }`}
            onClick={walletConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                <span>
                  {walletConnected ? "Disconnecting..." : "Connecting..."}
                </span>
              </>
            ) : walletConnected && walletAddress ? (
              <>
                <span className="wallet-status">✓</span>
                <span className="wallet-address">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </>
            ) : (
              <>
                <span className="wallet-icon">🔗</span>
                <span>Connect</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span
              className={`menu-icon ${mobileMenuOpen ? "open" : ""}`}
            ></span>
            <span
              className={`menu-icon ${mobileMenuOpen ? "open" : ""}`}
            ></span>
            <span
              className={`menu-icon ${mobileMenuOpen ? "open" : ""}`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-divider"></div>

          <button
            className={`wallet-button mobile-wallet-button ${
              walletConnected ? "connected" : "disconnected"
            }`}
            onClick={walletConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                <span>
                  {walletConnected ? "Disconnecting..." : "Connecting..."}
                </span>
              </>
            ) : walletConnected && walletAddress ? (
              <>
                <span className="wallet-status">✓</span>
                <span className="wallet-address">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </>
            ) : (
              <>
                <span className="wallet-icon">🔗</span>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
