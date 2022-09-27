// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IRegistry {
    struct Contributor {
        address account;
        uint256 maxTrust; // TODO: check type sizes
        uint256 balance;
    }

    /// @dev initialize the Registry,
    /// @param _admins (address[]) List of admins for the Registry contract.
    /// @param _tokenContract (address) CS token deployed contract address
    function initialize(address[] calldata _admins, address _tokenContract)
        external;

    /// @notice Register a contributor and set a non-zero max trust.
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor calldata) The address to register as contributor
    function registerContributor(Contributor calldata _contributors) external;

    /// @notice Remove an existing contributor.
    /// @dev Can only be called by Admin role.
    /// @param _adr (address) Address to remove
    function removeContributor(address _adr) external;

    // @notice Add pending balance of an address
    // @param _adr (address) Address to set
    // @param _value (uint256) Value to add to pending balance of the address
    function addPendingBalance(address _adr, uint256 _value) external;

    /// @notice Add to a list of contributors' pending balances
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor[] memory) Number of contributors to add pending balance. MaxTrust is ignored.
    function addPendingBalances(Contributor[] memory _contributors) external;

    /// @notice Set the contibutors pending balance to zero
    /// @dev Can only be called by the Minter
    /// @param _adr (address) Contributor address
    function clearPendingBalance(address _adr) external;

    /// @notice Set pending balance of an address
    /// @param _adr (address) Address to set
    /// @param _pendingBalance (uint256) Pending balance of the address
    function setPendingBalance(address _adr, uint256 _pendingBalance) external;

    /// @notice Set a list of contributors pending balances
    /// @dev Can only be called by Admin role.
    /// @param _contributors (Contributor[] calldata) Array of contributors to set pending balance, maxTrust is ignored
    function setPendingBalances(Contributor[] calldata _contributors) external;

    /// @notice Set a new token contracr
    /// @dev Can only be called by Admin role.
    /// @param _tokenContract (address) New token contract address
    function setTokenContract(address _tokenContract) external;

    /// @notice Set a new minter contract
    /// @dev Can only be called by Admin role.
    /// @param _minterContract (address) New minter contract address
    function setMinterContract(address _minterContract) external;

    /// @notice Return all registered contributor addresses.
    /// @return contributors (address[]) Adresses of all contributors
    function getContributors() external view returns (address[] memory);

    /// @notice Return contributor information about all accounts in the Registry.
    /// @return contributorList (Cotributor[]) Information of all contributors
    function getContributorInfo() external view returns (Contributor[] memory);

    /// @notice Return the max trust of an address, or 0 if the address is not a contributor.
    /// @param _adr (address) Address to check
    /// @return maxTrust (uint256) Max trust of the address, or 0 if not a contributor.
    function getMaxTrust(address _adr) external view returns (uint256);

    /// @notice Return the pending balance of an address, or 0 if the address is not a contributor.
    /// @param _adr (address) Address to check
    /// @return balance (uint256) Pending balance of the address, or 0 if not a contributor.
    function getPendingBalance(address _adr) external view returns (uint256);
}
