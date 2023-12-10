// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title LEG Contract
/// @author Thomas THIERRY
/// @notice This contract manages the creation of the LEG ERC20 token used in the DAO.
contract LEG is ERC20 {


    ///@dev constructor 'asked' by the OpenZeppelin contract
    constructor() ERC20("Legacy Token", "LEG") {

    }

    /// @notice Mints 1 LEG for each WETH locked by the sender in the vault. LEG are automatically associated with the sender.
    /// @param _amountLocked The amount of WETH locked by the sender in the vault.
    function mint(uint _amountLocked) external payable {
        _mint(msg.sender, _amountLocked);
    }

    /// @notice If the balance of LEG is sufficient, unwraps WETH to ETH and sends ETH to the caller. WETH are burned.
    /// @param _amount The amount of LEG to withdraw. 
    function withdraw(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "insufficient balance");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }
}