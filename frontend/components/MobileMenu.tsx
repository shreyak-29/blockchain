"use client";

import Link from "next/link";
import WalletButton from "./WalletButton";

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  links: NavLink[];
  walletConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onClose: () => void;
}

export default function MobileMenu({
  links,
  walletConnected,
  walletAddress,
  isConnecting,
  onConnect,
  onDisconnect,
  onClose,
}: MobileMenuProps) {
  return (
    <div className="border-t border-white/20 bg-white/5 px-4 py-4 backdrop-blur-lg sm:px-6">
      <ul className="flex list-none flex-col gap-2 m-0 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className="block rounded-lg px-4 py-3 text-base font-semibold text-white no-underline transition-all duration-200 hover:bg-white/20 active:scale-95 active:bg-white/30"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="my-4 border-t border-white/20" />

      <WalletButton
        connected={walletConnected}
        address={walletAddress}
        isConnecting={isConnecting}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
    </div>
  );
}
