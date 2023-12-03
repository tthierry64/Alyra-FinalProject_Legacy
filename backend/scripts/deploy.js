const hre = require("hardhat");

async function main() {

  const safetyModule = await hre.ethers.deployContract("SafetyModule");
  await safetyModule.waitForDeployment();

  console.log(`SafetyModule Contract deployed to ${safetyModule.target}`);
  const weth = await hre.ethers.deployContract("WETH");
  await weth.waitForDeployment();
  console.log(`WETH Contract deployed to ${weth.target}`);

  const vault = await hre.ethers.deployContract("Vault", [weth.target] );
  await vault.waitForDeployment();
  console.log(`Vault Contract deployed to ${vault.target}`);  

  const investor = await hre.ethers.deployContract("Investor", [weth.target, vault.target] );
  await investor.waitForDeployment();
  console.log(`Investor Contract deployed to ${investor.target}`);  

  const dao = await hre.ethers.deployContract("DAO", [weth.target, vault.target]);
  await dao.waitForDeployment();
  console.log(`DAO Contract deployed to ${dao.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
