"use client";

import { useTheme, useWallet } from "@/lib/hooks";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import NetworkInfo from "./NetworkInfo";
import ThemeToggle from "./ThemeToggle";
import WalletButton from "./WalletButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Register", href: "/register" },
  { label: "Transfer", href: "/transfer" },
  { label: "Verify", href: "/view" },
];

export default function Navbar() {
  const {
    walletConnected,
    walletAddress,
    isConnecting,
    handleConnect,
    handleDisconnect,
  } = useWallet();
  const { mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 gradient-primary shadow-lg">
      <div className="mx-auto max-w-7xl safe-area-padding py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 text-lg font-bold text-white no-underline transition-transform duration-300 hover:scale-105 active:scale-95 sm:text-2xl"
          >
            <span className="text-2xl sm:text-3xl">🏠</span>
            <span className="hidden font-extrabold tracking-tight sm:inline">
              BlockRegistry
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 justify-center md:flex">
            <ul className="flex list-none gap-1 m-0 p-0 lg:gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-white/20 active:scale-95 active:bg-white/30 lg:px-5 lg:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
            <div className="hidden lg:flex">
              <NetworkInfo />
            </div>

            <WalletButton
              connected={walletConnected}
              address={walletAddress}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5 rounded-lg border border-white/20 bg-white/15 p-2 transition-all duration-200 hover:border-white/30 hover:bg-white/25 active:scale-95 md:hidden"
              aria-label="Toggle mobile menu"
            >
              <span
                className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          links={NAV_LINKS}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          isConnecting={isConnecting}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
