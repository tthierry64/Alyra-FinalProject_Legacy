// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./WETH.sol";
import "./Investor.sol";

contract Yield {
    WETH public weth;
    Investor public investor;

   constructor(address _weth, address _investor) {
       weth = WETH(_weth);
       investor = Investor(_investor);
   }

    ///@dev This contract is a simulator of an invest that provides 10% interest of the original balance
    uint256 balance = weth.balanceOf(address(this));
    uint256 newBalance;

    ///@dev Mint 10% new WETH  
    function addInterests() external {
       newBalance = ((balance * 110) / 100);
       weth._mint(address(this), (newBalance - balance));
   }

    ///@dev send back all WETH to Investor contract
    function transferFundsToInvestor() external {
       weth.transfer(address _investor, weth.balanceOf(address(this)));
   }
}

