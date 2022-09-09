// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import {EnumerableSetUpgradeable as EnumerableSet} from "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./lib/AdminRole.sol";

// TODO: add IMinter.sol
// TODO: add IRegistry.sol

contract Registry is AdminRole {
    using EnumerableSet for EnumerableSet.AddressSet;

    //
    // STORAGE:
    //

    struct Contributor {
        address account;
        uint256 maxTrust; // TODO: check type size
        uint256 balance;
    }

    // EnumerableSet of all trusted accounts:
    EnumerableSet.AddressSet internal accounts;

    // stoken contract
    IERC20 internal tokenContract;

    // Minter contract address
    address public minterContract;

    // Mapping of account => Contributor:
    mapping(address => Contributor) contributors;

    modifier onlyMinter() {
        if (_msgSender() != minterContract) revert SenderMustBeMinter();
        _;
    }

    //
    // EXTERNAL FUNCTIONS:
    //

    /// @dev initialize the Registry,
    /// @param _admins (address[]) List of admins for the Registry contract.
    /// @param _tokenContract (address) CS token deployed contract address
    function initialize(address[] calldata _admins, address _tokenContract)
        public
        initializer
    {
        __AdminRole_init(_admins);
        tokenContract = IERC20(_tokenContract);
    }

    /// @notice Register a contributor and set a non-zero max trust.
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor calldata) The address to register as contributor
    function registerContributor(Contributor calldata _contributors)
        external
        onlyAdmin
    {
        _register(_contributors);
    }

    /// @notice Remove an existing contributor.
    /// @dev Can only be called by Admin role.
    /// @param _adr (address) Address to remove
    function removeContributor(address _adr) external onlyAdmin {
        _remove(_adr);
    }

    // @notice Add pending balance of an address
    // @param _adr (address) Address to set
    // @param _value (uint256) Value to add to pending balance of the address
    function addPendingBalance(address _adr, uint256 _value)
        external
        onlyAdmin
    {
        _addPendingBalance(_adr, _value);
    }

    /// @notice Add to a list of contributors' pending balances
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor[] memory) Number of contributors to add pending balance. MaxTrust is ignored.
    function addPendingBalances(Contributor[] memory _contributors)
        external
        onlyAdmin
    {
        uint256 length = _contributors.length;
        for (uint256 i = 0; i < length; ) {
            Contributor memory _contributor = _contributors[i];
            _addPendingBalance(_contributor.account, _contributor.balance);
            unchecked {
                i++;
            }
        }
    }

    /// @notice Set the contibutors pending balance to zero
    /// @dev Can only be called by the Minter
    /// @param _adr (address) Contributor address
    function clearPendingBalance(address _adr) external onlyMinter {
        if (!accounts.contains(_adr)) revert AccountNotRegistered();
        Contributor storage contributor = contributors[_adr];
        emit PendingBalanceCleared(_adr, contributor.balance);
        contributor.balance = 0;
    }

    //
    // INTERNAL FUNCTIONS:
    //

    function _register(Contributor calldata _contributor) internal {
        address account = _contributor.account;
        uint256 maxTrust = _contributor.maxTrust;
        uint256 balance = _contributor.balance;

        if (maxTrust == 0) revert MaxTrustMustBeNonZero();
        if (account == address(0)) revert AddressMustBeNonZero();
        if (!accounts.add(account)) revert AccountAlreadyRegistered();
        // TODO: check if balance should be added and not overwritten
        contributors[account] = Contributor(account, maxTrust, balance);

        emit ContributorAdded(account);
    }

    /// @notice Register a list of contributors with max trust amounts.
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor[] calldata) Number of contributors to add
    function registerContributors(Contributor[] calldata _contributors)
        external
        onlyAdmin
    {
        uint256 length = _contributors.length;
        for (uint256 i = 0; i < length; ) {
            _register(_contributors[i]);
            unchecked {
                i++;
            }
        }
    }

    function _remove(address _adr) internal {
        if (!accounts.remove(_adr)) revert AccountNotRegistered();
        delete contributors[_adr];
        emit ContributorRemoved(_adr);
    }

    function _setPendingBalance(address _adr, uint256 _pendingBalance)
        internal
    {
        if (!accounts.contains(_adr)) revert AccountNotRegistered();
        if (tokenContract.balanceOf(_adr) > 0) revert AccountIsActivtedMember();

        contributors[_adr].balance = _pendingBalance;

        emit PendingBalanceSet(_adr, _pendingBalance);
    }

    function _addPendingBalance(address _adr, uint256 _value) internal {
        if (!accounts.contains(_adr)) revert AccountNotRegistered();
        if (tokenContract.balanceOf(_adr) > 0) revert AccountIsActivtedMember();

        contributors[_adr].balance += _value;

        emit PendingBalanceRise(_adr, _value);
    }

    //
    // SETTER
    //

    /// @notice Set pending balance of an address
    /// @param _adr (address) Address to set
    /// @param _pendingBalance (uint256) Pending balance of the address
    function setPendingBalance(address _adr, uint256 _pendingBalance)
        external
        onlyAdmin
    {
        _setPendingBalance(_adr, _pendingBalance);
    }

    /// @notice Set a list of contributors pending balances
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor[] calldata) Array of contributors to set pending balance, maxTrust is ignored
    function setPendingBalances(Contributor[] calldata _contributors)
        external
        onlyAdmin
    {
        uint256 length = _contributors.length;
        for (uint256 i = 0; i < length; ) {
            Contributor memory _contributor = _contributors[i];
            _setPendingBalance(_contributor.account, _contributor.balance);
            unchecked {
                i++;
            }
        }
    }

    /// @notice Set a new token contracr
    /// @dev Can only be called by Admin role.
    /// @param _tokenContract (address) New token contract address
    function setTokenContract(address _tokenContract) external onlyAdmin {
        if (_tokenContract == address(0)) revert AddressMustBeNonZero();
        tokenContract = IERC20(_tokenContract);
    }

    /// @notice Set a new minter contract
    /// @dev Can only be called by Admin role.
    /// @param _minterContract (address) New minter contract address
    function setMinterContract(address _minterContract) external onlyAdmin {
        if (_minterContract == address(0)) revert AddressMustBeNonZero();
        minterContract = _minterContract;
    }

    //
    // VIEWS:
    //

    /// @notice Return all registered contributor addresses.
    /// @return contributors (address[]) Adresses of all contributors
    function getContributors() external view returns (address[] memory) {
        return accounts.values();
    }

    /// @notice Return contributor information about all accounts in the Registry.
    /// @return contributorList (Cotributor[]) Information of all contributors
    function getContributorInfo() external view returns (Contributor[] memory) {
        address[] memory contributorAddresses = accounts.values();
        uint256 len = contributorAddresses.length;
        Contributor[] memory contributorList = new Contributor[](len);

        for (uint256 i = 0; i < len; ) {
            address adr = contributorAddresses[i];
            contributorList[i] = contributors[adr];
            unchecked {
                i++;
            }
        }
        return contributorList;
    }

    /// @notice Return the max trust of an address, or 0 if the address is not a contributor.
    /// @param _adr (address) Address to check
    /// @return maxTrust (uint256) Max trust of the address, or 0 if not a contributor.
    function getMaxTrust(address _adr) external view returns (uint256) {
        return contributors[_adr].maxTrust;
    }

    /// @notice Return the pending balance of an address, or 0 if the address is not a contributor.
    /// @param _adr (address) Address to check
    /// @return balance (uint256) Pending balance of the address, or 0 if not a contributor.
    function getPendingBalance(address _adr) external view returns (uint256) {
        return contributors[_adr].balance;
    }

    //
    // EVENTS:
    //

    /// @dev Emit when a contributor has been added:
    event ContributorAdded(address adr);

    /// @dev Emit when a contributor has been removed:
    event ContributorRemoved(address adr);

    /// @dev Emit when a contributor's pending balance is set:
    event PendingBalanceSet(address indexed adr, uint256 pendingBalance);

    /// @dev Emit when a contributor's pending balance is risen:
    event PendingBalanceRise(address indexed adr, uint256 value);

    /// @dev Emit when a contributor's pending balance is cleared:
    event PendingBalanceCleared(
        address indexed adr,
        uint256 consumedPendingBalance
    );

    /// @dev Emit when minter contract address is set
    event MinterContractSet(address indexed adr);

    //
    // ERRORS:
    //
    
    error SenderMustBeMinter();
    error MaxTrustMustBeNonZero();
    error AddressMustBeNonZero();
    error AccountAlreadyRegistered();
    error AccountNotRegistered();
    error AccountIsActivtedMember();
}
