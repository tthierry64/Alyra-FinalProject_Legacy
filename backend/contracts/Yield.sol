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
   
    function addInterests() external {
       newBalance = ((newBalance * 110) / 100); 
   }

    function transferFundsToVault(address _addressVault) external {
       weth.transfer(_addressVault,(balance + ((newBalance-balance) / 2)));
   }

    function transferFundsToDAOTresory(address _addressDAOTresory) external {
       weth.transfer(_addressDAOTresory,(newBalance-balance)/2);
   }
}

