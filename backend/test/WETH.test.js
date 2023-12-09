const { assert, expect } = require("chai");
const { ethers } = require('hardhat');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("WETH tests", function () {
    async function deployContract() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    //deploy SafetyModule Contract
    const SafetyModule = await ethers.getContractFactory("SafetyModule");
    const safetymodule = await SafetyModule.deploy();
    //deploy WETH Contract    
    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy(safetymodule.target);
    return {weth, safetymodule, owner, addr1, addr2, addr3};
    };

    describe("Deployment", function () {
        it("Should deploy the smart contract", async function () {
            const [addr1] = await ethers.getSigners();
            const { weth } = await loadFixture(deployContract);
            expect(await weth.balanceOf(addr1)).to.equal(0);
        });
     
    });
   
    describe("Creation of token", function () {   
      it("should be named Wrapped Ether", async function () {
          const { weth } = await loadFixture(deployContract);          
          expect(await weth.name()).to.equal("Wrapped Ether")
      });

      it("should have WETH symbol", async function () {
          const { weth } = await loadFixture(deployContract); 
          expect(await weth.symbol()).to.equal("WETH")
      });

      it("should have a total supply of 0 at the deployment", async function () {
          const { weth, addr1 } = await loadFixture(deployContract); 
          expect(await weth.totalSupply(addr1)).to.equal(ethers.parseEther("0"))
      });
    });

    describe("Balance", function () {
        it("Should update user balance after deposit", async function () {
            const { weth,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('4');
            await weth.connect(addr1).deposit({ value: depositAmount });
            const finalBalance = await weth.connect(addr1).balanceOf(addr1.address);
            expect(finalBalance).to.be.equal(depositAmount * BigInt(80) / BigInt(100));
        });
    });

    describe("Deposit", function () {

        it("Should update user balance after deposit when ETH amount is greater than 0", async function () {
          const { weth, addr1 } = await loadFixture(deployContract);
          const depositAmount = ethers.parseEther('1');
          await weth.connect(addr1).deposit({ value: depositAmount });
          const finalBalance = await weth.connect(addr1).balanceOf(addr1.address);
          expect(finalBalance).to.be.equal(depositAmount  * BigInt(80) / BigInt(100));
      });     
            
    });
    
    describe("Withdraw", function () {
      it("Should fail if user tries to withdraw more than their balance", async function () {
          const { weth,addr1 } = await loadFixture(deployContract);
          const depositAmount = ethers.parseEther('1');
          await weth.connect(addr1).deposit({ value: depositAmount });
          const withdrawAmount = ethers.parseEther('2');
          await expect(weth.connect(addr1).withdraw(withdrawAmount))
           .to.be.revertedWith("Insufficient balance");
      });
    });  

    describe("Approve", function () {

      it("should emit Approval event", async function () {
        const { weth } = await loadFixture(deployContract);
        const [owner, spender] = await ethers.getSigners();
        const amount = ethers.parseEther("100");
        await expect(weth.approve(spender.address, amount)).to.emit(weth, 'Approval').withArgs(owner.address, spender.address, amount)
      });  
    });  

});  