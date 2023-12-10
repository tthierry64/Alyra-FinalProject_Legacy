const { assert, expect } = require("chai");
const { ethers } = require('hardhat');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("SafetyModule tests", function () {
    async function deployContract() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    //deploy Vault Contract
    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy();
    //deploy DAO Contract    
    const DAO = await ethers.getContractFactory("WETH");
    const dao = await DAO.deploy(vault.target);
    return {dao, vault, owner, addr1, addr2, addr3};
    };

    describe("Deployment", function () {
        it("Should deploy the smart contract", async function () {
            const [addr1] = await ethers.getSigners();
            const { dao } = await loadFixture(deployContract);
            expect(await dao.getBalanceOfUser(addr1)).to.equal(0);
        });

              
    });
}); 


