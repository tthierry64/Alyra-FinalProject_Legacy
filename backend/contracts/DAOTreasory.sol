// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./WETH.sol";

contract DAOTresory {

    WETH public weth;
    event Received(address, uint);

    ///@dev constructor 'asked' by the OpenZeppelin contract
    constructor(address _weth) {
        weth = WETH(_weth);
    }

   receive() external payable {
       emit Received(msg.sender, msg.value);
   }

   function withdrawETH(uint _amount) external {
        // Check if user has enough vlegETH
        require(weth.balanceOf(address(this)) >= _amount, "Insufficient balance");

        weth.withdraw(_amount);
    }
}
