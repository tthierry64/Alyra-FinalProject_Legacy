// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ERC4626Fees.sol";
import "./DAO.sol";

contract Vault is ERC4626Fees  {
    address payable public DAOTresory;
    uint8 internal maxLockDuration;
    uint256 internal amountLock;
    uint256 internal exitFeeBasisPoints;
    uint256 public balanceLocked;
    DAO public dao;
    
    constructor (IERC20 _asset, address payable _DAOTresory, address _DAO) ERC4626(_asset) ERC20("Vault Legacy Token", "vlegETH") {
        DAOTresory = _DAOTresory;
        dao = DAO(_DAO);
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

    ///@dev define the address where fees are send to
    function _exitFeeRecipient() internal view override returns (address) {
        return DAOTresory;
    }

        function withdraw(
        address receiver,
        address owner,
        uint256 assets) external {
        uint256 lockedBalance = dao.getBalanceWETHLocked(msg.sender);
        if(lockedBalance != 0) {

            assets -= lockedBalance;

        }
        _withdraw(receiver, owner, assets, , ,);
    }

}
