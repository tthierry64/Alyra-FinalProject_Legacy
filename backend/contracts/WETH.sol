// SPDX-License-Identifier: MIT

/// @notice My implementation of Wrapped Ether contract using 'ERC20 from OpenZeppelin'
/// @author Thomas THIERRY

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20 {


    ///@dev constructor 'asked' by the OpenZeppelin contract
    constructor() ERC20("Wrapped Ether", "WETH") { }

    /// @dev mint 1 WETH for each ETH sent by the sender. WETH are automatically associated to the sender 
    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    /// @dev If the balance of WETH is sufficient, unwrap WETH to ETH and send ETH to the caller. WETH are burned. 
    function withdraw(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "insufficient balance");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }

    /// @dev mint 1 WETH for each ETH sent by the sender. WETH are automatically associated to the sender 
    function mint(address _addr, uint _amount) external payable {
        _mint(_addr, _amount);
    }
}