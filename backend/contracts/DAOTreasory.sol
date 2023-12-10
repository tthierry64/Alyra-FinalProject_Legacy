// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./WETH.sol";

/// @title DAOTreasury Contract
/// @author Your Name
/// @notice This contract manages the treasury of the DAO and handles the withdrawal of ETH.
contract DAOTreasory {

    WETH public weth;
    event Received(address, uint);

    /// @notice The constructor for the DAOTreasury contract.
    /// @param _weth The address of the WETH contract.
    ///@dev constructor 'asked' by the OpenZeppelin contract
    constructor(address _weth) {
        weth = WETH(_weth);
    }

   /// @notice Allows the contract to receive ETH.
   /// @dev This function emits a Received event.
   receive() external payable {
       emit Received(msg.sender, msg.value);
   }

   /// @notice Allows the user to withdraw ETH from the contract.
   /// @param _amount The amount of ETH to withdraw.
   /// @dev This function checks if the contract has enough balance before withdrawing.
   function withdrawETH(uint _amount) external {
        require(weth.balanceOf(address(this)) >= _amount, "Insufficient balance");
        weth.withdraw(_amount);
    }
}
