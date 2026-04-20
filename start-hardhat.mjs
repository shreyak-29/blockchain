#!/usr/bin/env node

import { spawn } from "child_process";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting Hardhat Node with Auto-Deployment...\n");

// Use local hardhat from node_modules
const hardhatPath = path.join(__dirname, "node_modules", ".bin", "hardhat");
const isWin = process.platform === "win32";
const cmd = isWin ? hardhatPath + ".cmd" : hardhatPath;

let nodeReady = false;

// Start hardhat node
const node = spawn(cmd, ["node"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: isWin,
});

// Function to check if node is ready
function checkNodeReady() {
  return new Promise((resolve) => {
    const options = {
      hostname: "127.0.0.1",
      port: 8545,
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      nodeReady = true;
      resolve(true);
      req.destroy();
    });

    req.on("error", () => {
      resolve(false);
    });

    req.write(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "web3_clientVersion",
        params: [],
        id: 1,
      }),
    );
    req.end();
  });
}

// Wait for node to be ready, then deploy
async function waitForNodeAndDeploy() {
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max

  while (!nodeReady && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await checkNodeReady();
    attempts++;
    if (attempts % 5 === 0) {
      console.log(`⏳ Waiting for node... (${attempts}s)`);
    }
  }

  if (nodeReady) {
    console.log("\n\n✅ Node is ready! Deploying Contract...\n");

    const deploy = spawn(
      cmd,
      ["run", "scripts/deploy.js", "--network", "localhost"],
      {
        cwd: __dirname,
        stdio: "inherit",
        shell: isWin,
      },
    );

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
  } else {
    console.error("❌ Node failed to start after 30 seconds");
    node.kill();
    process.exit(1);
  }
}

// Start waiting for node
waitForNodeAndDeploy();

// Keep the process running
process.on("SIGINT", () => {
  console.log("\n\n👋 Stopping Hardhat Node...");
  node.kill();
  process.exit(0);
});
