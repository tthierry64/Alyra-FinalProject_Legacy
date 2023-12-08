// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./WETH.sol";
import "./Investor.sol";

contract Yield {
    uint256 balance;
    uint256 newBalance;
    WETH public weth;
    Investor public investor;

   constructor(address _weth, address _investor) {
       weth = WETH(_weth);
       investor = Investor(_investor);
   }

    ///@dev This contract is a simulator of an invest that provides 10% interest of the original balance


    function getBalanceWETH() public returns(uint) {
        balance = weth.balanceOf(address(this));
        return balance;
    }

    ///@dev Mint 10% new WETH  
    function addInterests() external {
       newBalance = ((balance * 110) / 100);
       weth.mint(address(this), (newBalance - balance));
   }

    ///@dev send back all WETH to Investor contract
    function transferFundsToInvestor() external {
       weth.transfer(address(investor), weth.balanceOf(address(this)));
   }
}