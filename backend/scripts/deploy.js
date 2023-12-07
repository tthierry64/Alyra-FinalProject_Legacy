const hre = require("hardhat");

async function main() {

  const safetyModule = await hre.ethers.deployContract("SafetyModule");
  await safetyModule.waitForDeployment();
  console.log(`SafetyModule Contract deployed to ${safetyModule.target}`);

  const weth = await hre.ethers.deployContract("WETH");
  await weth.waitForDeployment();
  console.log(`WETH Contract deployed to ${weth.target}`);

  const leg = await hre.ethers.deployContract("LEG");
  await leg.waitForDeployment();
  console.log(`LEG Contract deployed to ${leg.target}`);

  const daotreasory = await hre.ethers.deployContract("DAOTreasory", [weth.target]);
  await daotreasory.waitForDeployment();
  console.log(`DAOTreasory Contract deployed to ${daotreasory.target}`);

  const vault = await hre.ethers.deployContract("Vault", [weth.target, daotreasory.target]);
  await vault.waitForDeployment();
  console.log(`Vault Contract deployed to ${vault.target}`);  
  
  const dao = await hre.ethers.deployContract("DAO", [vault.target]);
  await dao.waitForDeployment();
  console.log(`DAO Contract deployed to ${dao.target}`);

  const investor = await hre.ethers.deployContract("Investor", [weth.target, vault.target, daotreasory.target]);
  await investor.waitForDeployment();
  console.log(`Investor Contract deployed to ${investor.target}`);
  
  const yield = await hre.ethers.deployContract("Yield", [weth.target, investor.target]);
  await yield.waitForDeployment();
  console.log(`Yield Contract deployed to ${yield.target}`);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
