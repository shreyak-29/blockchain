"use client";

import Link from "next/link";
import { useNetwork } from "@/lib/hooks";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    title: "Register Property",
    description: "Add your property to the blockchain registry",
    icon: "📝",
    href: "/register",
  },
  {
    title: "Transfer Ownership",
    description: "Securely transfer property to new owners",
    icon: "🔄",
    href: "/transfer",
  },
  {
    title: "Verify Property",
    description: "Check property details and ownership",
    icon: "✅",
    href: "/view",
  },
];

export default function HomePage() {
  const { network } = useNetwork();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl safe-area-padding py-12">
        {/* Hero Section */}
        <section className="mb-12 rounded-lg bg-gradient-primary px-6 py-12 text-center text-white shadow-lg">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">🏘️ Blockchain Real Estate Registry</h1>
          <p className="mb-6 text-base opacity-90 sm:text-lg">
            Secure, transparent property ownership management using Web3 technology
          </p>

          {network && (
            <div className="text-sm opacity-90 sm:text-base">
              <p>
                Connected to: <span className="font-bold">{network.name}</span>
              </p>
              {network.chainId === 31337 && (
                <p className="mt-2 text-xs opacity-75 sm:text-sm">
                  ⚠️ Local Development Network - For testing only
                </p>
              )}
            </div>
          )}
        </section>

        {/* Features Grid */}
        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group rounded-lg border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-3 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
              <div className="mt-4 inline-block text-blue-600 font-semibold group-hover:text-blue-700 dark:text-blue-400">
                Get Started →
              </div>
            </Link>
          ))}
        </section>

        {/* Info Section */}
        <section className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            <div>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                1
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Connect Wallet</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Connect your Web3 wallet to get started
              </p>
            </div>
            <div>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
                2
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Register Property</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Add your property details to the blockchain
              </p>
            </div>
            <div>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                3
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Manage & Verify</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Manage and verify properties transparently
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
