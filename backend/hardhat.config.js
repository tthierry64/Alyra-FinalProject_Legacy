require("@nomicfoundation/hardhat-toolbox");
require("hardhat-watcher");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  watcher: {
    test: {
      tasks: ["test"],
      files: ["./test/**/*"],
    },
  },
};