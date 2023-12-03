// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ERC4626Fees.sol";
import "./DAO.sol";

contract Vault is ERC4626Fees  {
    address payable public vaultOwner; // Set the address where the fess will be transfer to
    uint8 internal maxLockDuration;
    uint256 internal amountLock;
    uint256 internal exitFeeBasisPoints;
    
    constructor (IERC20 _asset) ERC4626(_asset) ERC20("Vault Legacy Token", "vlegETH") {
        vaultOwner = payable(msg.sender);
    }

    function setMaxDurationUser(uint8 _duration, uint256 _amount) external {
        maxLockDuration = _duration;
        amountLock = _amount;
    }

    function setFee() external returns (uint256) {
        uint bps = 400;
        if(maxLockDuration == 1) {
            exitFeeBasisPoints = bps * 875 / 1000;
        } else if (maxLockDuration == 3) {
            exitFeeBasisPoints = bps * 75 / 100;            
        } else if (maxLockDuration == 9 && amountLock > 5000000000000000000) {
            exitFeeBasisPoints = bps * 75 / 100;            
        } else {
            exitFeeBasisPoints = bps;
        }
        return exitFeeBasisPoints;
    }

    function _exitFeeBasisPoints() internal view override returns (uint256) {
        return exitFeeBasisPoints;
    }

    function _exitFeeRecipient() internal view override returns (address) {
        return vaultOwner;
    }
}
