// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./WETH.sol";
import "./Vault.sol";

contract DAO {

    uint8 maxDuration;

    struct User {
        bool hasLocked;
        uint balanceLEG;
        uint balanceWETH;        
        uint balanceVlegETH;
        Locked[] _locked;
        bool alive;
        uint lastConnection;
        uint8 maxLockedDuration;
    }

    struct Locked {
        uint balanceWETHLocked;
        uint8 duration;
        uint balanceAvailable;
    }

    mapping(address => User) public user;

    WETH public weth;
    Vault public vault;

    constructor(address _weth, address _vault) {
        weth = WETH(_weth);
        vault = Vault(_vault);
    }

    ///@dev Proof of life
    function checkAlive(address _addressUser) external {
        require(user[_addressUser].alive, "User is not alive.");
        if (block.timestamp - user[_addressUser].lastConnection > 6 * 30 days) {
            user[_addressUser].alive = false;
        }
    }

    ///@notice Allows to get the amount of ethers the user has on the smart contract 
    ///@return The amount of ethers the user has on the smart contract
    function getBalanceWETH(address _user) external view returns(uint) {
        return user[_user].balanceWETH;
    }

    ///@notice Allows to get the amount of ERC4626Token the user has on the smart contract 
    ///@return The amount of ethers the user has on the smart contract
    function getBalanceVlegETH(address _user) external view returns(uint) {
        return user[_user].balanceVlegETH;
    }
    ///@notice Allows to get the amount of ERC4626Token the user has on the smart contract 
    ///@return The amount of ethers the user has on the smart contract
    function getBalanceLEG(address _user) external view returns(uint) {
        return user[_user].balanceLEG;
    }

    function getBalanceWETHLocked(address _user) external view returns (uint) {
        uint _balanceWETHLocked;
        for (uint i = 0; i < user[_user]._locked.length; i++) {       
            _balanceWETHLocked += user[_user]._locked[i].balanceWETHLocked;
        }       
        return _balanceWETHLocked;
    }
    
    function getMaxLockDuration(address _user) external returns(uint) {        
        for (uint i = 0; i < user[_user]._locked.length; i++) {
            if(user[_user]._locked[i].duration > maxDuration) {
                maxDuration = user[_user]._locked[i].duration;
            }
        }
        return maxDuration;
    }

    function getUser(address _user) external view returns (User memory) {
        return user[_user];
    }

    function setMaxDuration(address _user) external {
        user[_user].maxLockedDuration = maxDuration;
    }    

    function depositVault() external payable {
        // Transfer ETH of sender to WETH contract to get WETH
        weth.deposit{value: msg.value}();
        // update ERC20 WETH balance of sender
        user[msg.sender].balanceWETH += msg.value;
        // Send WETH to the Vault contract with approval associated to the specific amount
        weth.approve(address(vault), msg.value);
        vault.deposit(msg.value, msg.sender);
        // update ERC4626 vLegETH balance of sender
        user[msg.sender].balanceVlegETH += msg.value;
        user[msg.sender].alive = true;    
    }
    
    function withdrawVault(uint _amount) external {
        // Check if user has enough vlegETH
        require(user[msg.sender].balanceVlegETH >= _amount, "Insufficient balance");
        // Retirer vlegETH de l'utilisateur
        user[msg.sender].balanceVlegETH -= _amount;
        // Vérifier que l'utilisateur a suffisamment de WETH pour retirer
        require(_amount >= weth.balanceOf(msg.sender), "Insufficient WETH balance");
        //Withdraw WETH agains vlegETH from Vault contract
        vault.withdraw(_amount, msg.sender, msg.sender);
        // Get WETH of user and convert it to ETH
        user[msg.sender].balanceWETH -= _amount;
        weth.withdraw(_amount);
        // Send ETH to user
        payable(msg.sender).transfer(_amount);
    }

        
     
    function simulateUser(address _user) external {
        // Créer une nouvelle instance de la structure Locked
        Locked memory locked1 = Locked(10, 6, 5);
        Locked memory locked2 = Locked(100, 9, 4);

        // Ajouter les instances de Locked au tableau _locked de l'utilisateur
        user[_user]._locked.push(locked1);
        user[_user]._locked.push(locked2);
    }
    // ///@dev function called when a user, connected to the Dapp make a first deposit
    // function registerUser() external {
    //     user[msg.sender].
    // }
}