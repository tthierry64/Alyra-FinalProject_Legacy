// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./WETH.sol";
import "./Vault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Investor Contract
/// @author Thomas THIERRY
/// @notice This contract manages the investment of WETH from the vault.
contract Investor is Ownable {
    WETH public weth;
    Vault public vault;
    uint balanceSend;
    uint newBalance;
    address public DAOTresoryContractAddress;
    address public yieldContractAdrress;

    /// @notice The constructor for the Investor contract.
    /// @param _weth The address of the WETH contract.
    /// @param _vault The address of the Vault contract.
    /// @param _DAOTresory The address of the DAOTresory contract.
    /// @dev Necessary constructor to use the Ownable contract and set the address deploying the contract as owner
    constructor(address _weth, address _vault, address _DAOTresory) Ownable(msg.sender) {
        weth = WETH(_weth);
        vault = Vault(_vault);
        DAOTresoryContractAddress = _DAOTresory;
    }

    /// @notice Callback function that is called when the contract receives ERC20 tokens. This function returns the selector of the onERC20Received function, which is a constant defined by the ERC20 interface. This constant is used to indicate that the contract accepts ERC20 tokens.
    /// @dev This function returns the function selector of the onERC20Received function, which is a constant defined by the ERC20 interface. This constant is used to indicate that the contract accepts ERC20 tokens.
    /// @return The function selector of the onERC20Received function.
    function onERC20Received(address, address, uint256, bytes calldata) external pure returns(bytes4) {
        return this.onERC20Received.selector;
    }

    /// @notice Returns the balance of WETH that the contract has.
    /// @return The balance of WETH that the contract has.
    function getBalance() external view returns(uint) {
        return weth.balanceOf(address(this));
    }

    /// @notice Sends all WETH to the Yield contract to get interest.
    /// @dev This function can only be called by the owner of the contract.
    /// @param _yield The address of the Yield contract.   
    function sendTokensToYield(address _yield) external onlyOwner {
        balanceSend = weth.balanceOf(address(this));
        weth.transfer(address(_yield), balanceSend);
    }
    
    /// @notice Updates the balance of WETH and then dispatches between the Vault and DAOTresory contracts.
    /// @dev This function can only be called by the owner of the contract.
    ///@dev Vault : (intial WETH balance + 50%of interest) and DAOTrasory (only 50% of interest) contracts
    function sendTokensBack() external onlyOwner{
       newBalance = weth.balanceOf(address(this));      
       weth.transfer(address(vault), (balanceSend + ((newBalance-balanceSend) / 2)));
       weth.transfer(DAOTresoryContractAddress, ((newBalance-balanceSend)/2));
    } 
}