const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");

  const realEstate = await RealEstate.deploy();

  await realEstate.waitForDeployment();

  const contractAddress = await realEstate.getAddress();
  console.log("Contract deployed to:", contractAddress);

  // Save contract address to JSON file for frontend
  const addressData = {
    RealEstate: contractAddress,
    deployedAt: new Date().toISOString(),
  };

  const contractAddressPath = path.join(
    __dirname,
    "../frontend/contractAddress.json",
  );
  fs.writeFileSync(contractAddressPath, JSON.stringify(addressData, null, 2));
  console.log("Contract address saved to:", contractAddressPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
