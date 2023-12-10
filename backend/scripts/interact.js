const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

  const safetyModule = await hre.ethers.deployContract("SafetyModule");
  await safetyModule.waitForDeployment();
  console.log(`SafetyModule Contract deployed to ${safetyModule.target}`);
  
  const weth = await hre.ethers.deployContract("WETH", [safetyModule.target]);
  await weth.waitForDeployment();
  console.log(`WETH Contract deployed to ${weth.target}`);

  // Déposer 0.1 ETH
  const depositAmount = ethers.parseEther('0.1');
  await weth.deposit({ value: depositAmount });
  console.log(`We try to make a deposit of ${depositAmount} ETH in the protocol and balance of user in SafetyModule must be 20% of deposit`);

  // Récupérer le solde de WETH sûr pour l'adresse de l'expéditeur
  const senderBalance = await weth.getETHSafe(process.env.SENDER_ADDRESS);
  console.log(`Balance of user in SafetyModule = ${senderBalance} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
