// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Vault.sol";

contract DAO is ERC20 {

    Vault public vault;

    struct User {
        uint balanceLEG;
        bool alive;
        uint lastConnection;
        uint LEGToMint;
        uint alreadyMint;
    }

    mapping(address => User) public user;

    constructor(address _vault) ERC20("Legacy Token", "LEG"){
        vault = Vault(_vault);
    }

    function getLegToMint() public view returns(uint){
        return vault.getLegToMint(msg.sender) - user[msg.sender].alreadyMint;
    }

    function getLEG(uint _amount) external {
        require(user[msg.sender].alreadyMint + _amount <= vault.getLegToMint(msg.sender), "Max LEG alredy mint or demand to mint too many LEG");
        user[msg.sender].LEGToMint = _amount;
        _mint(msg.sender, user[msg.sender].LEGToMint);
        user[msg.sender].alreadyMint += _amount;
        user[msg.sender].LEGToMint -= _amount;        
    }    

    ///@notice Allows to get the amount of ERC4626Token the user has on the smart contract
    ///@return The amount of ethers the user has on the smart contract
    function getBalanceLEG(address _user) external view returns(uint) {
        return user[_user].balanceLEG;
    }
}