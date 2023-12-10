// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SafetyModule.sol";

/// @title WETH Contract
/// @author Thomas THIERRY
/// @notice This contract manages the conversion of 80% of the ETH deposited into WETH (ERC20) and transfers the remaining 20% to the SafetyModule contract. It manages the WETH throughout the protocol's process.
pragma solidity ^0.8.20;
contract WETH is ERC20, Ownable {

    SafetyModule public safetymodule;

    mapping (address => uint) private balancesETHSafe;

    /// @notice The constructor for the WETH contract.
    /// @dev This function initializes the contract with the SafetyModule contract, 'asked' by the OpenZeppelin ERC20 contract
    /// @param _safetymodule The address of the SafetyModule contract.
    constructor(address payable  _safetymodule) ERC20("Wrapped Ether", "WETH") Ownable(msg.sender) {
        safetymodule = SafetyModule(_safetymodule);
     }

    /// @notice Allows a user to deposit ETH into the contract. The contract mints 1 WETH for each ETH sent by the sender. WETH are automatically associated with the sender. 20% of this are sent to the SafetyModule contract.
    /// @dev The function checks if the deposited amount is greater than or equal to 0.1 ETH. If it is, it sends 20% of the deposited amount to the SafetyModule contract, adds the remaining 80% to the sender's balance, and emits a `Transfer` event.
    function deposit() external payable {
        require(msg.value >= (1e17), "Insufficient deposit, minimum 0,1 ETH");
        uint _amount20 = (msg.value / 5) ;
        (bool success,) = address(safetymodule).call{value: _amount20}("");
        require(success, "Failed to send 20% of Ether deposit");
        balancesETHSafe[msg.sender] += _amount20;
        _mint(msg.sender, msg.value - _amount20);
    }

    /// @notice Allows a user to withdraw WETH from the contract.
    /// @dev The function checks if the user has enough balance to withdraw the requested amount. If the user has enough balance, it burns the requested amount of WETH, sends the requested     amount of ETH to the user, and emits a `Transfer` event.
    /// @param _amount The amount of WETH the user wants to withdraw 
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

    function getETHSafe(address _addr) public view returns (uint) {
        return balancesETHSafe[_addr];
    }
}