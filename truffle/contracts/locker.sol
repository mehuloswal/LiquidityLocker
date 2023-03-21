// SPDX-License-Identifier: UNLICENSED
/*
This is a liquidity locker for any kind of ERC20 token.
Comments have been mentioned for understanding every step.
*/

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Locker is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public feePercentage;
    bool public isPaused;

    struct Lock {
        uint256 id;
        IERC20 tokenAddress;
        address owner; // the one who wants to lock
        uint256 amount; // amount of tokens to be locked
        uint256 startDate; // UNIX timestamp
        uint256 endDate; // UNIX timestamp + required duration in UNIX timestamp.
    }

    Lock[] public locks;
    IERC20[] tokenAddressesWithFees; //to withdraw the tokens by using a 'for' loop.

    mapping(IERC20 => uint256) public tokensFees; // Fees per ERC20 token type.
    mapping(address => Lock[]) public myLocks; // one user can have many locks at the same time.
    mapping(IERC20 => Lock[]) public tokenLocks; // one type of token can have many locks at the same time.
    mapping(address => mapping(uint256 => uint256)) public globalToPersonalLock;
    mapping(IERC20 => mapping(uint256 => uint256)) public globalToTokenLock;

    // Events
    event LockCreated(
        uint256 _id,
        IERC20 _tokenAddress,
        address _owner,
        uint256 _amount,
        uint256 _startDate,
        uint256 _endDate
    );
    event Unlock(
        uint256 _id,
        IERC20 _tokenAddress,
        address _owner,
        uint256 _amount
    );

    constructor(uint256 _feePercentage) {
        feePercentage = _feePercentage;
    }

    //Modifiers
    modifier onlyUserAllowed() {
        require(
            tx.origin == msg.sender,
            "The caller can not be another smart contract!"
        );
        _;
    }

    // Receive function to allow the smart contract to receive ether
    receive() external payable {}

    function createLock(
        IERC20 _tokenAddress,
        uint256 _amount,
        uint256 _duration,
        uint8 _selector
    ) external nonReentrant onlyUserAllowed returns (uint256) {
        // returns an '_id' from the locks[] which is required to unlock the lock.
        require(isPaused == false, "The smart contract is Paused!");
        require(_amount > 0, "Amount should be greater than zero");
        require(
            (_selector >= 1 && _selector <= 7),
            "Range of selector variable gone wrong"
        );
        require(
            _tokenAddress.approve(address(this), _amount),
            "Failed to approve tokens"
        );
        require(
            IERC20(_tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Tokens Transfer to the Locker Failed!"
        );

        uint256 _unlockDuration = getSeconds(_selector, _duration);

        uint256 _id = locks.length;

        // fee calculation
        uint256 lockAmount = _amount;
        uint256 fee = lockAmount.mul(feePercentage).div(10000); //base to 10000 => double decimal only. 0.51% = 51/10000;
        uint256 _amountAfterFeeSubtracted = lockAmount.sub(fee);
        if (tokensFees[_tokenAddress] == 0) {
            tokenAddressesWithFees.push(_tokenAddress);
        }
        tokensFees[_tokenAddress] = tokensFees[_tokenAddress].add(fee);

        Lock memory newLock = Lock(
            _id,
            _tokenAddress,
            msg.sender,
            _amountAfterFeeSubtracted,
            block.timestamp,
            block.timestamp + _unlockDuration
        );

        locks.push(newLock);

        globalToPersonalLock[msg.sender][_id] = myLocks[msg.sender].length;
        globalToTokenLock[_tokenAddress][_id] = tokenLocks[_tokenAddress]
            .length;

        myLocks[msg.sender].push(newLock);
        tokenLocks[_tokenAddress].push(newLock);

        emit LockCreated(
            _id,
            _tokenAddress,
            msg.sender,
            _amountAfterFeeSubtracted,
            block.timestamp,
            block.timestamp + _unlockDuration
        );
        return (_id);
    }

    function unlockTokens(uint256 _id) external returns (bool) {
        require(isPaused == false, "The smart contract is paused!");

        Lock memory _lock = locks[_id];

        require(
            _lock.endDate <= block.timestamp,
            "You can't withdraw yet! Wait until the lock period ends."
        );

        // Fetching the other values for that id to withdraw.
        uint256 _amount = _lock.amount;
        IERC20 _tokenAddress = _lock.tokenAddress;
        uint256 _personalId = globalToPersonalLock[msg.sender][_id];
        uint256 _tokenId = globalToTokenLock[_tokenAddress][_id];

        require(
            msg.sender == _lock.owner,
            "You are not the owner of the lock!"
        );
        require(_amount != 0, "You have already withdrawn the tokens!");

        require(
            _tokenAddress.transfer(_lock.owner, _amount),
            "Transaction failed!"
        ); //Transfering of tokens.

        locks[_id].amount = 0;
        myLocks[msg.sender][_personalId].amount = 0;
        tokenLocks[_tokenAddress][_tokenId].amount = 0;

        emit Unlock(_lock.id, _tokenAddress, _lock.owner, _amount);

        return true;
    }

    /* Helper Functions */
    function getSeconds(
        uint256 _selector,
        uint256 _duration
    ) internal pure returns (uint256) {
        if (_selector == 1) {
            //sec
            return _duration;
        } else if (_selector == 2) {
            //min
            return _duration * 1 minutes;
        } else if (_selector == 3) {
            //hours
            return _duration * 1 hours;
        } else if (_selector == 4) {
            //days
            return _duration * 1 days;
        } else if (_selector == 5) {
            //weeks
            return _duration * 1 weeks;
        } else if (_selector == 6) {
            //months
            return _duration * 1 days * 30;
        } else {
            //years
            return _duration * 1 days * 365;
        }
    }

    /* Setting the attributes. */
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(
            (_feePercentage <= 10000 && _feePercentage > 0),
            "Fee should not exceed 100%"
        );
        feePercentage = _feePercentage;
    }

    function togglePause() external onlyOwner {
        if (!isPaused) {
            isPaused = true;
        } else {
            isPaused = false;
        }
    }

    /* Getters */
    function getGlobalLockFromPersonal(
        address _userAddress,
        uint256 _index
    ) public view returns (Lock memory) {
        uint256 _id = globalToPersonalLock[_userAddress][_index];

        return locks[_id];
    }

    function getGlobalLockFromToken(
        IERC20 _tokenAddress,
        uint256 _index
    ) public view returns (Lock memory) {
        uint256 _id = globalToTokenLock[_tokenAddress][_index];

        return locks[_id];
    }

    function getTokenBalance(
        IERC20 _tokenAddress
    ) public view returns (uint256) {
        return _tokenAddress.balanceOf(address(this));
    }

    function getMyLocksIds(
        address _userAddress
    ) public view returns (uint256[] memory) {
        uint256 myLocksLength = myLocks[_userAddress].length;
        uint256[] memory allMyLocksIds = new uint256[](myLocksLength);
        for (uint i = 0; i < myLocksLength; i++) {
            uint256 index = myLocks[_userAddress][i].id;
            allMyLocksIds[i] = index;
        }
        return allMyLocksIds;
    }

    function getMyLocks(
        address _userAddress
    ) public view returns (Lock[] memory) {
        uint256 myLocksLength = myLocks[_userAddress].length;
        Lock[] memory allMyLocks = new Lock[](myLocksLength);
        for (uint i = 0; i < myLocksLength; i++) {
            uint256 index = myLocks[_userAddress][i].id;
            Lock memory _lock = locks[index];
            allMyLocks[i] = _lock;
        }
        return allMyLocks;
    }

    /* Withdraw tokens from the contract. */
    function withdrawFees(
        address payable _withdrawalAddress
    ) external onlyOwner {
        for (uint256 i = 1; i <= tokenAddressesWithFees.length; i++) {
            IERC20 _tokenAddress = tokenAddressesWithFees[
                tokenAddressesWithFees.length - i
            ];
            uint256 _amountFee = tokensFees[_tokenAddress];
            if (_amountFee > 0) {
                require(
                    _tokenAddress.transfer(_withdrawalAddress, _amountFee),
                    "Transfer Failed"
                );
            }
            delete tokensFees[_tokenAddress];
            tokenAddressesWithFees.pop();
        }

        tokenAddressesWithFees = new IERC20[](0);
    }
}
