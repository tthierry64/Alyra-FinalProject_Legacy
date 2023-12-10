// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SafetyModule Contract
/// @author Thomas THIERRY
/// @notice This contract serves as the liquidity reserve of the Protocol, enabling it to repay users if the funds are still locked in the vault.
contract SafetyModule {

    struct Account {
        uint balance;
        uint lastDeposit;
    }

    mapping(address => Account) accounts;

    event etherDeposited(address indexed account, uint amount);
    event etherWithdrawed(address indexed account, uint amount);
    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    /// @notice Allows the user to withdraw ethers from the smart contract 
    /// @dev The function checks if the user has enough balance to withdraw the requested amount. If the user has enough balance, it subtracts the amount from the user's balance, emits an `etherWithdrawed` event, and sends the requested amount of ethers to the user. If the user does not have enough balance, it reverts the transaction.
    /// @param _amount The amount of ethers the user wants to withdraw
    function withdraw(uint _amount) external {
        require(accounts[msg.sender].balance >= _amount, "Not enough funds");
        accounts[msg.sender].balance -= _amount;
        emit etherWithdrawed(msg.sender, _amount);
        (bool received, ) = msg.sender.call{value: _amount}("");
        require(received, "An error occured");
    }

    ///@notice Allows a user to deposit ethers on the smart contract
    /// @dev The function checks if the deposited amount is greater than zero. If it is, it adds the deposited amount to the user's balance and updates the user's last deposit timestamp. It also emits an `etherDeposited` event.   
    function deposit() external payable {
        require(msg.value > 0, "Not enough funds deposited");
        accounts[msg.sender].balance += msg.value;
        accounts[msg.sender].lastDeposit = block.timestamp;
        emit etherDeposited(msg.sender, msg.value);
    }

    /// @notice Allows to get the amount of ethers the user has on the smart contract 
    /// @dev This function returns the balance of the user.
    /// @return The amount of ethers the user has on the smart contract
    function getBalanceOfUser() external view returns(uint) {
        return accounts[msg.sender].balance;
    }

    /// @dev This function returns the timestamp of the user's last deposit.
    /// @return The timestamp of last deposit
    function getLastDepositOfUser() external view returns(uint) {
        return accounts[msg.sender].lastDeposit;
    }

}