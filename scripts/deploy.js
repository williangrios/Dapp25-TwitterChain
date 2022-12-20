const hre = require("hardhat");

async function main() {
  const TC = await hre.ethers.getContractFactory("TwitterChain");
  const tc = await TC.deploy();
  await tc.deployed();
  console.log(
    `Deployed to ${tc.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
