// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./WETH.sol";
import "./Vault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Investor is Ownable {
    WETH public weth;
    Vault public vault;

        /// @dev Necessary constructor to use the Ownable contract and set the address deploying the contract as owner
    constructor(address _weth, address _vault) Ownable(msg.sender) {
        weth = WETH(_weth);
        vault = Vault(_vault);
    }

    //fonction de rappel qui est appelée lorsque le contrat reçoit des tokens ERC20. Cette fonction retourne le sélecteur de la fonction onERC20Received, qui est une constante définie par l'interface ERC20. Cette constante est utilisée pour indiquer que le contrat accepte les tokens ERC20
    function onERC20Received(address, address, uint256, bytes calldata) external pure returns(bytes4) {
        return this.onERC20Received.selector;
    }

    function getBalance() external view returns(uint) {
        return weth.balanceOf(address(this));
    }

    function sendBackTokens(uint256 _amount) external onlyOwner {
        weth.transfer(address(vault), _amount);
    }

    function sendTokens(address _investContract, uint256 _amount) external onlyOwner {
        weth.transfer(address(_investContract), _amount);
    }    

}