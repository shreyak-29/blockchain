"use client";

import Navbar from "@/components/Navbar";
import { getContract, getExplorerUrl, getNetworkInfo } from "@/utils/contract";
import { ethers } from "ethers";
import { useState } from "react";
import toast from "react-hot-toast";

interface PropertyData {
  id: string;
  location: string;
  price: string;
  owner: string;
}

export default function VerifyPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [network, setNetwork] = useState<any>(null);

  const loadProperty = async () => {
    if (!id.trim()) {
      toast.error("Please enter a property ID");
      return;
    }

    setLoading(true);
    try {
      const netInfo = await getNetworkInfo();
      setNetwork(netInfo);

      const contract = await getContract();

      if (!contract) {
        throw new Error("Failed to connect to contract");
      }

      const result = await contract.getProperty(BigInt(id));

      // Check if property exists
      if (result[3] === "0x0000000000000000000000000000000000000000") {
        toast.error("Property not found. Please register this property first.");
        setData(null);
      } else {
        const propertyData = {
          id: result[0].toString(),
          location: result[1],
          price: result[2],
          owner: result[3],
        };
        setData(propertyData);
        toast.success("Property found!");
      }
    } catch (err: any) {
      console.error("Error fetching property:", err);

      let errorMessage = "Failed to fetch property";
      if (err.message.includes("could not decode")) {
        errorMessage =
          "Property not found. Please register this property first.";
      } else if (err.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user.";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadProperty();
    }
  };

  const formatPrice = (weiValue: string): string => {
    try {
      const eth = ethers.formatEther(weiValue);
      return `${parseFloat(eth).toFixed(4)} ETH`;
    } catch {
      return weiValue;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      <main className="mx-auto max-w-2xl safe-area-padding py-12">
        <div className="rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800 p-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              ✅ Verify Property
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Check property details and ownership on the blockchain
            </p>
          </div>

          {/* Search Form */}
          <div className="mb-8 space-y-4">
            <div>
              <label
                htmlFor="propertyId"
                className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
              >
                Property ID
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="propertyId"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter property ID to search"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-150 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:ring-blue-500/20"
                  disabled={loading}
                />
                <button
                  onClick={loadProperty}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div>
              {data ? (
                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-700/50">
                  {/* Property Basic Info */}
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                      Property Details
                    </h2>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-600 sm:flex-row sm:justify-between">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Property ID:
                        </span>
                        <span className="font-mono text-slate-900 dark:text-white">
                          {data.id}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-600 sm:flex-row sm:justify-between">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Location:
                        </span>
                        <span className="text-right text-slate-900 dark:text-white">
                          {data.location}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-600 sm:flex-row sm:justify-between">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Price:
                        </span>
                        <span className="font-mono text-slate-900 dark:text-white">
                          {formatPrice(data.price)}
                        </span>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="block font-semibold text-blue-600 dark:text-blue-400">
                          Owner Address:
                        </span>
                        <div className="flex flex-col gap-2">
                          <code className="rounded bg-slate-200 px-3 py-2 font-mono text-xs break-all dark:bg-slate-600">
                            {data.owner}
                          </code>
                          {network?.explorer && (
                            <a
                              href={getExplorerUrl(
                                "address",
                                data.owner,
                                network.explorer,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 w-fit"
                            >
                              View on Explorer 🔗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                  <div className="text-sm font-semibold text-red-900 dark:text-red-300">
                    ✗ Property Not Found
                  </div>
                  <div className="mt-2 text-sm text-red-800 dark:text-red-200">
                    The property ID you entered does not exist or hasn&apos;t
                    been registered yet. Please check the ID and try again.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
