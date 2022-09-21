// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AdminRole is Initializable, OwnableUpgradeable {
    mapping(address => bool) public admins;

    modifier onlyAdmin() {
        if (!admins[msg.sender] || msg.sender == owner()) revert CallerIsNoAdmin();
        _;
    }

    /**
     * @dev Initialize contract with an list of admins.
     * Deployer address is an admin by default.
     * @param _accounts An optional list of admin addresses.
     */
    function __AdminRole_init(address[] calldata _accounts) internal onlyInitializing {
        __Ownable_init();
        _addAdmins(_accounts);
    }

    /**
     * @dev Add the Admin role to an address. Can only be called by an Admin.
     * @param _account The address to receive Admin role
     */
    function addAdmin(address _account) public onlyAdmin {
        _addAdmin(_account);
    }

    /**
     * @dev Add the Admin role to a list of addresses. Can only be called by an Admin.
     * @param _accounts An optional list of admin addresses.
     */
    function addAdmins(address[] calldata _accounts) public onlyAdmin {
        _addAdmins(_accounts);
    }

    /**
     * @dev Remove the admin role from the caller. Can only be called by an Admin.
     */
    function renounceAdmin() public onlyAdmin {
        _removeAdmin(msg.sender);
    }

    /**
     * @dev Remove the admin role from an admin account. Can only be called by the Owner.
     * @param _account The address to remove
     */
    function removeAdmin(address _account) public onlyOwner {
        _removeAdmin(_account);
    }

    // ================= Views =================

    /**
     * @dev Check if address has the Admin role on the contract.
     * @param _account The address being checked
     * @return True, if it has the Admin role
     */
    function isAdmin(address _account) external view returns (bool) {
        return admins[_account];
    }

    // ================= Internal =================

    /**
     * @dev Internal function. Add the Admin role to an address.
     * @param _account The address to receive Admin role
     */
    function _addAdmin(address _account) internal {
        if (_account == address(0)) revert ZeroAddressNotAllowed();
        if (admins[_account]) revert AccountIsAlreadyAdmin();
        admins[_account] = true;
        emit AdminAdded(_account);
    }

    /**
     * @dev Internal function. Add the Admin role to a list of addresses.
     * @param _accounts An optional list of admin addresses.
     */
    function _addAdmins(address[] memory _accounts) internal {
        uint256 length = _accounts.length;
        for (uint256 i = 0; i < length; ) {
            address account = _accounts[i];
            if (account != msg.sender && !admins[account]) {
                _addAdmin(account);
            }
            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev Internal function. Remove the admin role from an admin account.
     * @param _account The address to remove
     */
    function _removeAdmin(address _account) internal {
        if (!admins[_account]) revert AccountIsNotAdmin();
        admins[_account] = false;
        emit AdminRemoved(_account);
    }

    // ================= Events =================

    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);

    // ================= Error =================

    error CallerIsNoAdmin();
    error AccountIsAlreadyAdmin();
    error AccountIsNotAdmin();
    error ZeroAddressNotAllowed();
}
