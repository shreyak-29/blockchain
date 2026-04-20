#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting Hardhat Node with Auto-Deployment...\n");

// Use local hardhat from node_modules
const hardhatPath = path.join(__dirname, "node_modules", ".bin", "hardhat");
const isWin = process.platform === "win32";
const cmd = isWin ? hardhatPath + ".cmd" : hardhatPath;

// Start hardhat node
const node = spawn(cmd, ["node"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: isWin,
});

// Wait a bit for the node to start, then deploy
setTimeout(() => {
  console.log("\n\n⏳ Deploying Contract...\n");

  const deploy = spawn(cmd, ["deploy-and-save", "--network", "localhost"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: isWin,
  });

  deploy.on("close", (code) => {
    if (code === 0) {
      console.log("\n✅ Contract deployed successfully!");
      console.log(
        "🎯 Contract address saved to frontend/contractAddress.json\n",
      );
    } else {
      console.error("❌ Deployment failed with code:", code);
    }
  });
}, 3000);

// Keep the process running
process.on("SIGINT", () => {
  console.log("\n\n👋 Stopping Hardhat Node...");
  node.kill();
  process.exit(0);
});
