// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./WETH.sol";
import "./Vault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Investor is Ownable {
    WETH public weth;
    Vault public vault;
    uint balanceSend;
    uint newBalance;
    address public DAOTresoryContractAddress;
    address public yieldContractAdrress;

        /// @dev Necessary constructor to use the Ownable contract and set the address deploying the contract as owner
    constructor(address _weth, address _vault, address _DAOTresory) Ownable(msg.sender) {
        weth = WETH(_weth);
        vault = Vault(_vault);
        DAOTresoryContractAddress = _DAOTresory;
    }

    //fonction de rappel qui est appelée lorsque le contrat reçoit des tokens ERC20. Cette fonction retourne le sélecteur de la fonction onERC20Received, qui est une constante définie par l'interface ERC20. Cette constante est utilisée pour indiquer que le contrat accepte les tokens ERC20
    function onERC20Received(address, address, uint256, bytes calldata) external pure returns(bytes4) {
        return this.onERC20Received.selector;
    }

    function getBalance() external view returns(uint) {
        return weth.balanceOf(address(this));
    }

    ///@dev Send all WETH to the Yield contract to get interest    
    function sendTokensToYield(address _yield) external onlyOwner {
        balanceSend = weth.balanceOf(address(this));
        weth.transfer(address(_yield), balanceSend);
    }

    ///@dev First update balance of WETH and then dispatch between Vault (intial WETH balance + 50%of interest) and DAOTrasory (only 50% of interest) contracts
    function sendTokensBack() external onlyOwner{
       newBalance = weth.balanceOf(address(this));      
       weth.transfer(address(vault), (balanceSend + ((newBalance-balanceSend) / 2)));
       weth.transfer(DAOTresoryContractAddress, ((newBalance-balanceSend)/2));
    } 

    function getFromVault(uint _amount) external onlyOwner  {
        weth.transferFrom(address(vault), address(this), _amount);
    }
}