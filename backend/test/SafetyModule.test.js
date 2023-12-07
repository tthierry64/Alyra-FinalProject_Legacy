const { assert, expect } = require("chai");
const { ethers } = require('hardhat');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("SafetyModule tests", function () {
    async function deployContract() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const SafetyModule = await ethers.getContractFactory("SafetyModule");
    const safetymodule = await SafetyModule.deploy(SafetyModule);
    return {safetymodule, owner, addr1, addr2, addr3};
    };

    describe("Deployment", function () {
        it("Should deploy the smart contract", async function () {
            const [addr1] = await ethers.getSigners();
            const { safetymodule } = await loadFixture(deployContract);
            expect(await safetymodule.getBalanceOfUser(addr1)).to.equal(0);
        });
       
    });
    describe("Balance", function () {
        it("Should return correct user balance", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('4');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const balance = await safetymodule.connect(addr1).getBalanceOfUser();
            expect(balance).to.be.equal(depositAmount);
        });
    });   
       
    describe("Deposit", function () {
        it("Should deposit founds", async function () {
            const { safetymodule } = await loadFixture(deployContract);
            let depositAmount = ethers.parseEther('1');
            await safetymodule.deposit({ value: depositAmount });
            const balance = await safetymodule.getBalanceOfUser();
            assert.equal(balance, depositAmount);
        });

        it("Should increase balance", async function () {
            const { safetymodule, addr1 } = await loadFixture(deployContract);
            const depositAmount2 = ethers.parseEther('4');
            await safetymodule.connect(addr1).deposit({ value: depositAmount2 });
            const depositAmount = ethers.parseEther('5');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const balance = await safetymodule.connect(addr1).getBalanceOfUser();
            expect(balance).to.be.equal(ethers.parseEther('9'));
         });

     
        it("Should revert if not enough founds", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            let depositAmount = await ethers.parseEther('0');
            await expect(safetymodule.connect(addr1).deposit({ value: depositAmount })).to.be.revertedWith("Not enough funds deposited");
        });

        it("Should update time of last deposit ", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('4');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const lastDeposit = await safetymodule.connect(addr1).getLastDepositOfUser();
            const latestTime = await helpers.time.latest();
            expect(lastDeposit).to.be.equal(latestTime);
        });

        it("Should fail if user tries to deposit zero", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('0');
            await expect(safetymodule.connect(addr1).deposit({ value: depositAmount }))
             .to.be.revertedWith("Not enough funds deposited");
           });
               
         
        it("Should emit etherDeposited event after deposit", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('4');
            await expect(safetymodule.connect(addr1).deposit({ value: depositAmount }))
               .to.emit(safetymodule, 'etherDeposited')
               .withArgs(addr1.address, depositAmount);
        });
           
    })
    describe("Withdraw", function () {
        it("Should reduce user balance after withdraw", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('4');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const initialBalance = await safetymodule.connect(addr1).getBalanceOfUser();
            const withdrawAmount = ethers.parseEther('2');
            await safetymodule.connect(addr1).withdraw(withdrawAmount);
            const finalBalance = await safetymodule.connect(addr1).getBalanceOfUser();
            expect(finalBalance).to.be.equal(initialBalance - withdrawAmount);
        });

        it("Should fail if user does not have enough funds for withdrawal", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('1');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const withdrawAmount = ethers.parseEther('2');
            await expect(safetymodule.connect(addr1).withdraw(withdrawAmount))
               .to.be.revertedWith("Not enough funds");
           });           

        it("Should emit etherWithdrawed event after withdraw", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('4');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const withdrawAmount = ethers.parseEther('2');
            await expect(safetymodule.connect(addr1).withdraw(withdrawAmount))
               .to.emit(safetymodule, 'etherWithdrawed')
               .withArgs(addr1.address, withdrawAmount);
        });
        
        it("Should fail if user tries to withdraw more than their balance", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('1');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const withdrawAmount = ethers.parseEther('2');
            await expect(safetymodule.connect(addr1).withdraw(withdrawAmount))
              .to.be.revertedWith("Not enough funds");
        });
           
        it("Should fail if user tries to withdraw after withdrawing all their balance", async function () {
            const { safetymodule,addr1 } = await loadFixture(deployContract);
            const depositAmount = ethers.parseEther('1');
            await safetymodule.connect(addr1).deposit({ value: depositAmount });
            const withdrawAmount = ethers.parseEther('1');
            await safetymodule.connect(addr1).withdraw(withdrawAmount);
            await expect(safetymodule.connect(addr1).withdraw(withdrawAmount))
              .to.be.revertedWith("Not enough funds");
        });
              
    });
}); 


