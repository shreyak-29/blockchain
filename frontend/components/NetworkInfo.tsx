"use client";

import { useNetwork, useWallet } from "@/lib/hooks";
import { getExplorerUrl } from "@/utils/contract";

export default function NetworkInfo() {
  const { network, isLoading } = useNetwork();
  const { walletAddress } = useWallet();

  if (isLoading || !network || !walletAddress) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4">
      <div className="glass-effect flex items-center gap-1 rounded-md px-2 py-1.5 text-xs sm:gap-2 sm:px-3 sm:text-sm">
        <span className="hidden font-semibold text-white/80 sm:inline">
          Network:
        </span>
        <span className="font-mono text-white">{network.name}</span>
      </div>

      <div className="glass-effect flex items-center gap-1 rounded-md px-2 py-1.5 text-xs sm:gap-2 sm:px-3 sm:text-sm">
        <span className="hidden font-semibold text-white/80 sm:inline">
          Wallet:
        </span>
        <span className="font-mono text-white">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
        {network.explorer && (
          <a
            href={getExplorerUrl("address", walletAddress, network.explorer)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-white transition-colors hover:text-yellow-300 sm:ml-2"
            aria-label="View on explorer"
          >
            🔗
          </a>
        )}
      </div>
    </div>
  );
}
