// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ERC4626Fees.sol";
import "./DAO.sol";

contract Vault is ERC4626Fees  {
    address payable public DAOTreasory;
    uint8 internal maxLockDuration;
    uint256 internal amountLock;
    uint256 internal exitFeeBasisPoints;
    uint256 internal balanceLocked;

    struct User {
        bool alive;
        uint lastConnection;
        uint legToMint;
    }

    struct Lock {
        uint256 amount;
        uint256 startTime;
        uint256 lockDuration;
        address beneficiary;
        bool unlocked;
    }

    struct LockBeneficiary {
        uint256 amount;
        uint256 startTime;
        uint256 lockDuration;
        address legatee;
        bool unlocked;
    }

    mapping(address => User) public user;    
    mapping(address => uint) public totalLocked;
    mapping(address => uint) public numberOfLocks;
    mapping(address => uint) public maxLocked;
    mapping(address => uint) public maxDuration;
    mapping(address => bool) public hasFuturLegacy;
    mapping(address => mapping(uint => Lock)) public locks;
    mapping(address => mapping(uint => LockBeneficiary)) public locksBenef;
    mapping(address => uint) public lockCount;
    mapping(address => uint) public lockCountBenef;
    mapping(address => uint) public lockCountStart; ///@dev used for front
    mapping(address => uint) public lockCountEnd; ///@dev used for front
    mapping(address => uint) public lockCountStartBenef; ///@dev used for front
    mapping(address => uint) public lockCountEndBenef; ///@dev used for front      

    constructor (IERC20 _asset, address payable _DAOTreasory) ERC4626(_asset) ERC20("Vault Legacy Token", "vlegETH") {
        DAOTreasory = _DAOTreasory;      
    }    

    function setMAxDuration(uint _duration) external {
        if(_duration > maxDuration[msg.sender]) {
            maxDuration[msg.sender] = _duration;
        }
    }

    function setFee() public returns (uint256) {
        uint bps = 400;
        if(maxDuration[msg.sender] == 1) {
            exitFeeBasisPoints = bps * 875 / 1000;
        } else if (maxDuration[msg.sender] == 3) {
            exitFeeBasisPoints = bps * 75 / 100;
        } else if (maxDuration[msg.sender] == 6) {
            exitFeeBasisPoints = bps * 625 / 1000;                 
        } else if (maxDuration[msg.sender] == 9 && totalLocked[msg.sender] > 5000000000000000000) {
            exitFeeBasisPoints = bps * 50 / 100;            
        } else {
            exitFeeBasisPoints = bps;
        }
        return exitFeeBasisPoints;
    }

    function getLockCount(address _user) external view returns (uint) {
        return lockCount[_user];
    }
    function getLockCountStart(address _user) external view returns (uint) {
        return lockCountStart[_user];
    }
    function getLockCountEnd(address _user) external view returns (uint) {
        return lockCountEnd[_user];
    }

    function getLockCountBenef(address _user) external view returns (uint) {
        return lockCountBenef[_user];
    }
    function getLockCountStartBenef(address _user) external view returns (uint) {
        return lockCountStartBenef[_user];
    }
    function getLockCountEndBenef(address _user) external view returns (uint) {
        return lockCountEndBenef[_user];
    } 
 

    ///@dev Proof of life
    function checkAlive(address _addressUser) external {
        require(!user[_addressUser].alive, "User is not alive.");
        if (block.timestamp - user[_addressUser].lastConnection > 6 * 30 days) {
            user[_addressUser].alive = false;
        }
    }
    function setLastConnection() external {
            user[msg.sender].lastConnection = block.timestamp;
    }    
    function getAlive(address _addressUser) view external returns(bool) {
        return user[_addressUser].alive;
    }   

    function getLegToMint(address _addrUser) view external returns(uint) {
        return user[_addrUser].legToMint;
    }                  

    function lockTokens(uint256 _amount, uint256 _lockDuration, address _beneficiary) external {
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance to lock");
        require(_lockDuration == 1 || _lockDuration == 3 || _lockDuration == 6 || _lockDuration == 9, "Duration must be 1, 3, 6 or 9 years");
        Lock memory newLock = Lock(_amount, block.timestamp, _lockDuration, _beneficiary, false);
        LockBeneficiary memory newLockBenef = LockBeneficiary(_amount, block.timestamp, _lockDuration, msg.sender, false);        
        uint lockId = lockCount[msg.sender]++;
        uint lockId2 = lockCountBenef[_beneficiary]++;
        lockCountEnd[msg.sender] = lockId;
        lockCountEndBenef[msg.sender] = lockId2;
        locks[msg.sender][lockId] = newLock;
        locksBenef[_beneficiary][lockId] = newLockBenef;
        _transfer(msg.sender, address(this), _amount);
        if(_amount > maxLocked[msg.sender]) {
            maxLocked[msg.sender] = _amount;
        }
        if(_lockDuration > maxDuration[msg.sender]) {
            maxDuration[msg.sender] = _lockDuration;
        }
        totalLocked[msg.sender] += _amount;
        hasFuturLegacy[_beneficiary] = true;
        user[msg.sender].legToMint += _amount;
        numberOfLocks[msg.sender] ++;
    }

    function claimUnlockTokensBenef(uint lockId2) external {
        require(lockCountBenef[msg.sender] > lockId2, "Invalid lock id");
        require(!user[(locksBenef[msg.sender][lockId2].legatee)].alive, "legatee still alive");
        LockBeneficiary storage userLockBenef = locksBenef[msg.sender][lockId2];
        require(!userLockBenef.unlocked, "Tokens already unlocked");
        require((block.timestamp - userLockBenef.startTime) > userLockBenef.lockDuration, "Lock duration not passed");
        lockCountStartBenef[msg.sender] ++;
        transferFrom(address(this), msg.sender, userLockBenef.amount);
        userLockBenef.unlocked = true;
    }            

    function claimTokens(uint lockId) external {
        require(lockCount[msg.sender] > lockId, "Invalid lock id");
        Lock storage userLock = locks[msg.sender][lockId];
        require(!userLock.unlocked, "Tokens already unlocked");
        require((block.timestamp - userLock.startTime) > userLock.lockDuration, "Lock duration not passed");
        transferFrom(address(this), msg.sender, userLock.amount);
        userLock.unlocked = true;
        numberOfLocks[msg.sender] --;
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        uint256 unlockableShares = shares;
        if(totalLocked[owner] > 0){
            shares = totalLocked[owner];
        }
        uint256 fee = _feeOnRaw(unlockableShares, _exitFeeBasisPoints());
        address recipient = _exitFeeRecipient();
        super._withdraw(caller, receiver, owner, assets, unlockableShares);
        if (fee > 0 && recipient != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient, fee);
        }
    }      

    function _exitFeeBasisPoints() internal view override returns (uint256) {
        return exitFeeBasisPoints;
    }


    ///@dev define the address where fees are send to
    function _exitFeeRecipient() internal view override returns (address) {
        return DAOTreasory;
    }
}