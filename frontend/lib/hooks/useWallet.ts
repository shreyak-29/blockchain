import {
  connectWallet,
  disconnectWallet,
  getWalletAddress,
} from "@/utils/contract";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UseWalletReturn {
  walletConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkWalletConnection = useCallback(async () => {
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
  }, []);

  // Setup wallet event listeners
  useEffect(() => {
    setMounted(true);
    checkWalletConnection();

    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      ethereum.on("accountsChanged", checkWalletConnection);
      ethereum.on("chainChanged", checkWalletConnection);

      return () => {
        ethereum.removeListener("accountsChanged", checkWalletConnection);
        ethereum.removeListener("chainChanged", checkWalletConnection);
      };
    }
  }, [checkWalletConnection]);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWalletConnected(true);
        setWalletAddress(address);
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const result = await disconnectWallet();
      if (result) {
        setWalletConnected(false);
        setWalletAddress(null);
        toast.success("Wallet disconnected");
      }
    } catch (error) {
      console.error("Disconnection error:", error);
      toast.error("Failed to disconnect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    walletConnected,
    walletAddress,
    isConnecting,
    handleConnect,
    handleDisconnect,
  };
}
