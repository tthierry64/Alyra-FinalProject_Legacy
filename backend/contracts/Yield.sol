// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./WETH.sol";
import "./Investor.sol";


/// @title Yield Contract
/// @author Your Name
/// @notice This contract is a simulator of an investment that provides 10% interest of the original balance.
contract Yield {
    uint256 balance;
    uint256 newBalance;
    WETH public weth;
    Investor public investor;

   constructor(address _weth, address _investor) {
       weth = WETH(_weth);
       investor = Investor(_investor);
   }

    /// @notice Gets the balance of WETH in the contract.
    /// @dev This function returns the balance of WETH in the contract.
    /// @return The balance of WETH in the contract.
    function getBalanceWETH() public view returns(uint) {
        return weth.balanceOf(address(this));
    }

    /// @notice Adds 10% interest to the contract's balance.
    /// @dev This function calculates the new balance by adding 10% to the current balance, and then mints new WETH to the contract.
    function addInterest() external {
        balance = weth.balanceOf(address(this));
        newBalance = ((balance * 101) / 100);
        weth.mint(address(this), (newBalance - balance));
    }

    /// @notice Transfers all WETH in the contract to the Investor contract.
    /// @dev This function transfers all WETH in the contract to the Investor contract.
    function transferFundsToInvestor() external {
       weth.transfer(address(investor), weth.balanceOf(address(this)));
   }
}