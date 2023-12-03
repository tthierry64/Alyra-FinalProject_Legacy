// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Invest {
   ERC20 public weth;

   constructor(address _weth) {
       weth = ERC20(_weth);
   }
}