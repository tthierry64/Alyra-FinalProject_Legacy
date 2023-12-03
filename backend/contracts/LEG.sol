// SPDX-License-Identifier: MIT

/// @notice Creation of ERC20 : Leagacy Token used in the DAO
/// @author Thomas THIERRY

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LEG is ERC20 {


    ///@dev constructor 'asked' by the OpenZeppelin contract
    constructor() ERC20("Legacy Token", "LEG") {

    }

    /// @dev mint 1 LEG for each WETH locked by the sender in the vault. LEG are automatically associated to the sender 
    function mint(uint _amountLocked) external payable {
        _mint(msg.sender, _amountLocked);
    }

    /// @dev If the balance of LEG is sufficient, unwrap WETH to ETH and send ETH to the caller. WETH are burned. 
    function withdraw(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "insufficient balance");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }
}