"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { getContract, getNetworkInfo, getExplorerUrl } from "@/utils/contract";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function TransferPage() {
  const [formData, setFormData] = useState({
    id: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txData, setTxData] = useState(null);

  const validateForm = () => {
    if (!formData.id || !formData.address) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.address)) {
      toast.error("Invalid Ethereum address. Must be 42 characters starting with 0x");
      return false;
    }

    if (isNaN(Number(formData.id)) || Number(formData.id) < 0) {
      toast.error("Property ID must be a valid positive number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const contract = await getContract();
      const netInfo = await getNetworkInfo();

      if (!contract || !netInfo) {
        throw new Error("Failed to connect to contract or network");
      }

      const tx = await contract.transferProperty(formData.id, formData.address);

      toast.loading("Transaction pending...");

      const receipt = await tx.wait();

      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || tx.gasPrice;
      const gasFees = gasUsed * gasPrice;
      const gasFeeInEth = ethers.formatEther(gasFees);

      setTxData({
        hash: receipt.hash,
        blockNumber: receipt.blockNumber.toString(),
        from: receipt.from,
        to: receipt.to,
        gasUsed: gasUsed.toString(),
        gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        gasFees: gasFeeInEth,
        network: netInfo,
        newOwner: formData.address,
        status: receipt.status === 1 ? "Success" : "Failed",
      });

      setSuccess(true);
      setFormData({ id: "", address: "" });
      toast.success("Property transferred successfully!");
    } catch (err: any) {
      console.error("Transfer error:", err);

      let errorMessage = "Failed to transfer property";
      if (err.message.includes("Not owner")) {
        errorMessage = "You are not the owner of this property.";
      } else if (err.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas fees";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error. Please check your connection";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      <main className="mx-auto max-w-2xl safe-area-padding py-12">
        <div className="rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800 p-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              🔄 Transfer Property
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Transfer property ownership to a new address
            </p>
          </div>

          {/* Success Message */}
          {success && txData && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
              <div className="mb-4 text-lg font-bold text-green-900 dark:text-green-300">
                ✓ Property Transferred Successfully!
              </div>

              <div className="space-y-4">
                {/* New Owner */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    👤 New Owner:
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-slate-100 px-3 py-2 font-mono text-xs break-all dark:bg-slate-700">
                      {txData.newOwner}
                    </code>
                    {txData.network?.explorer && (
                      <a
                        href={getExplorerUrl("address", txData.newOwner, txData.network.explorer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View 🔗
                      </a>
                    )}
                  </div>
                </div>

                {/* Transaction Hash */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    📝 Transaction Hash:
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-slate-100 px-3 py-2 font-mono text-xs break-all dark:bg-slate-700">
                      {txData.hash}
                    </code>
                    {txData.network?.explorer && (
                      <a
                        href={getExplorerUrl("tx", txData.hash, txData.network.explorer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View 🔗
                      </a>
                    )}
                  </div>
                </div>

                {/* Gas Stats */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded bg-slate-100 p-3 dark:bg-slate-700">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      ⛽ Gas Used
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {Number(txData.gasUsed).toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded bg-slate-100 p-3 dark:bg-slate-700">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      💰 Gas Price
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {parseFloat(txData.gasPrice).toFixed(2)} Gwei
                    </div>
                  </div>
                  <div className="rounded bg-slate-100 p-3 dark:bg-slate-700">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      💸 Total Fees
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {parseFloat(txData.gasFees).toFixed(6)} ETH
                    </div>
                  </div>
                  <div className="rounded bg-green-100 p-3 dark:bg-green-900/30">
                    <div className="text-xs font-semibold text-green-700 dark:text-green-300">
                      ✅ Status
                    </div>
                    <div className="mt-1 text-sm font-bold text-green-700 dark:text-green-300">
                      {txData.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property ID */}
            <div>
              <label htmlFor="id" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Property ID
              </label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Enter property ID to transfer"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-150 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:ring-blue-500/20"
                disabled={loading}
              />
            </div>

            {/* Recipient Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="0x..."
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-500 transition-all duration-150 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:ring-blue-500/20"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                💡 Enter a valid Ethereum address (42 characters starting with 0x)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Transferring...
                </div>
              ) : (
                "Transfer Property"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
