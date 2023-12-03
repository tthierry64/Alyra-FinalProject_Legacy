const { expect } = require("chai");

describe("WETH", function() {
 let WETH;
 let hardhatWETH;
 let owner;
 let addr1;
 let addr2;
 let addrs;

 beforeEach(async function () {
   WETH = await ethers.getContractFactory("WETH");
   [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

   hardhatWETH = await WETH.deploy();
   await hardhatWETH.deployed();
 });

 describe("Deployment", function () {
   it("Should set the right owner", async function () {
     expect(await hardhatWETH.owner()).to.equal(owner.address);
   });

   it("Should assign the total supply of tokens to the owner", async function () {
     const ownerBalance = await hardhatWETH.balanceOf(owner.address);
     expect(await hardhatWETH.totalSupply()).to.equal(ownerBalance);
   });
 });

 describe("Deposit", function () {
   it("Should increase the balance of the sender", async function () {
     await hardhatWETH.connect(addr1).deposit({value: ethers.utils.parseEther("1.0")});
     expect(await hardhatWETH.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("1.0"));
   });
 });

 describe("Withdraw", function () {
   it("Should decrease the balance of the sender", async function () {
     await hardhatWETH.connect(addr1).deposit({value: ethers.utils.parseEther("1.0")});
     await hardhatWETH.connect(addr1).withdraw(ethers.utils.parseEther("1.0"));
     expect(await hardhatWETH.balanceOf(addr1.address)).to.equal(0);
   });

   it("Should revert if the sender does not have enough balance", async function () {
     await expect(hardhatWETH.connect(addr1).withdraw(ethers.utils.parseEther("1.0"))).to.be.revertedWith("insufficient balance");
   });
 });
});
