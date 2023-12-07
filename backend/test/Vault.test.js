const { assert, expect } = require("chai");
const { ethers } = require('hardhat');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("Vault tests", function () {
    async function deployContract() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    //deploy WETH Contract
    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();
    //deploy DAOTreasory
    const DAOTreasory = await ethers.getContractFactory("DAOTreasory");
    const daotreasory = await DAOTreasory.deploy(weth.target);
    //deploy Vault
    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(weth.target, daotreasory.target);
    return {weth, daotreasory, vault, owner, addr1, addr2, addr3};
    };

    describe("Deployment", function () {
        it("Should deploy the smart contract", async function () {
            const { vault, addr1 } = await loadFixture(deployContract);
            expect(await vault.balanceOf(addr1)).to.equal(0);
        });
     
    });

    describe("setMAxDuration", function () {
        it("Should set max duration correctly", async function () {
            const { owner, vault } = await loadFixture(deployContract);
            await vault.connect(owner).setMAxDuration(100);
            const maxDuration = await vault.maxDuration(owner.address);
            expect(maxDuration).to.equal(100);
        });
     });
     
     describe("getAlive", function () {
        it("Should return the correct alive status if no deposit done before", async function () {
           const { owner, vault } = await loadFixture(deployContract);
           // Call setLastConnection
           await vault.connect(owner).setLastConnection();
           const isAlive = await vault.getAlive(owner.address);
           expect(isAlive).to.equal(false);
        });
       });
       
       describe("checkAlive", function () {
        it("Should check alive status correctly", async function () {
           const { owner, vault } = await loadFixture(deployContract);
           // Call checkAlive
           await vault.connect(owner).checkAlive(owner.address);
           const isAlive = await vault.getAlive(owner.address);
           expect(isAlive).to.equal(false);
        });
       });
});