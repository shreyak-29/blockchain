import { getNetworkInfo } from "@/utils/contract";
import { useCallback, useEffect, useState } from "react";

interface NetworkInfo {
  chainId: number;
  name: string;
  explorer: string | null;
}

interface UseNetworkReturn {
  network: NetworkInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNetwork(): UseNetworkReturn {
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNetwork = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const netInfo = await getNetworkInfo();
      if (netInfo) {
        setNetwork(netInfo);
      } else {
        setError("Failed to load network info");
      }
    } catch (err) {
      console.error("Network loading error:", err);
      setError("Failed to load network info");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNetwork();

    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      ethereum.on("chainChanged", loadNetwork);

      return () => {
        ethereum.removeListener("chainChanged", loadNetwork);
      };
    }
  }, [loadNetwork]);

  return {
    network,
    isLoading,
    error,
    refetch: loadNetwork,
  };
}
