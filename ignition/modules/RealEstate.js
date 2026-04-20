// This setup uses Hardhat Ignition to manage smart contract deployments.

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RealEstateModule", (m) => {
  const realEstate = m.contract("RealEstate");

  return { realEstate };
});
