"use client";

interface WalletButtonProps {
  connected: boolean;
  address: string | null;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export default function WalletButton({
  connected,
  address,
  isConnecting,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  const handleClick = connected ? onDisconnect : onConnect;

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 whitespace-nowrap text-xs font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-65 sm:px-4 sm:text-sm ${
        connected
          ? "border-green-500/40 bg-linear-to-r from-green-500/20 to-emerald-500/20 text-white hover:border-green-500/60 hover:from-green-500/30 hover:to-emerald-500/30 hover:-translate-y-0.5"
          : "border-blue-500/40 bg-linear-to-r from-blue-500/20 to-purple-500/20 text-white hover:border-blue-500/60 hover:from-blue-500/30 hover:to-purple-500/30 hover:-translate-y-0.5"
      }`}
    >
      {isConnecting ? (
        <>
          <span className="inline-block h-3.5 w-3.5 animate-spin-smooth rounded-full border-2 border-white/40 border-t-white" />
          <span className="hidden sm:inline">
            {connected ? "Disconnecting..." : "Connecting..."}
          </span>
        </>
      ) : connected && address ? (
        <>
          <span className="text-base font-bold">✓</span>
          <span className="hidden font-mono text-xs tracking-tight sm:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </>
      ) : (
        <>
          <span className="text-base">🔗</span>
          <span className="hidden sm:inline">Connect</span>
        </>
      )}
    </button>
  );
}
