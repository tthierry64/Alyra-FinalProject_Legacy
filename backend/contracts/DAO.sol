// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Vault.sol";

/// @title DAO Contract
/// @author Thomas THIERRY
/// @notice This contract manages the users of the DAO and handles the minting and burning of LEG tokens.
contract DAO is ERC20 {

    Vault public vault;

   /// @title User
   /// @notice This struct stores information about a user.
    struct User {
        uint balanceLEG;
        bool alive;
        uint lastConnection;
        uint LEGToMint;
        uint alreadyMint;
    }

    mapping(address => User) public user;

   /// @notice The constructor for the DAO contract.
   /// @param _vault The address of the Vault contract.
    constructor(address _vault) ERC20("Legacy Token", "LEG"){
        vault = Vault(_vault);
    }

   /// @notice Returns the amount of LEG tokens that the user can mint.
   /// @return The amount of LEG tokens that the user can mint.
    function getLegToMint() public view returns(uint){
        return vault.getLegToMint(msg.sender) - user[msg.sender].alreadyMint;
    }

   /// @notice Allows the user to mint LEG tokens.
   /// @param _amount The amount of LEG tokens to mint.
    function getLEG(uint _amount) external {
        require(user[msg.sender].alreadyMint + _amount <= vault.getLegToMint(msg.sender), "Max LEG alredy mint or demand to mint too many LEG");
        user[msg.sender].LEGToMint = _amount;
        _mint(msg.sender, user[msg.sender].LEGToMint);
        user[msg.sender].alreadyMint += _amount;
        user[msg.sender].LEGToMint -= _amount;        
    }

   /// @notice Allows the user to burn LEG tokens.
   /// @param _amount The amount of LEG tokens to burn.
    function burnLeg(uint _amount) external {
        _burn(msg.sender, _amount);
    }    


   /// @notice Returns the balance of LEG tokens that a user has on the smart contract.
   /// @param _user The address of the user.
   /// @return The balance of LEG tokens that the user has on the smart contract.
    function getBalanceLEG(address _user) external view returns(uint) {
        return user[_user].balanceLEG;
    }
}