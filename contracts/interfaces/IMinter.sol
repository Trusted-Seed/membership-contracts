// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

/// @title IMinter
/// @notice Token minter interface
interface IMinter {

  function initialize(
        address _bridge,
        address _tokenManager,
        address _registry,
        address _tokenContract
    ) external;
    //// ADMIN FUNCTIONS:

    /// @notice Set the address of the token manager that mints the tokens.
    /// @dev Must be called by an Admin account
    /// @param _tokenManager The new Token Manager contract address
    function setTokenManagerContract(address _tokenManager) external;

    /// @notice Set the address of the token contract.
    /// @dev Must be called by an Admin account.
    /// @param _token The new token contract address
    function setTokenContract(address _token) external;

    /// @notice Set the address of the Registry.
    /// @dev Must be called by an Admin account
    /// @param _registry The new Registry contract address
    function setRegistry(address _registry) external;

    /// @notice Set the ratio (numerator/denominator) used for minting calculation.
    /// @dev Can only be called by an Admin account.
    /// @param _numerator The ratio numerator
    /// @param _denominator The ratio denominator
    function setRatio(uint256 _numerator, uint256 _denominator) external;

    /// @notice Set the membership dues that need to be donated to actvate a membership.
    /// @dev Can only be called by an Admin account.
    /// @param _amount The amount to set the new dues to
    function setMembershipDues(uint256 _amount) external;

    /// @notice Bridge a donation transaction to the minter contract.
    ///
    /// The donation will call ethe underlying mnt function.
    ///
    /// @dev Cano only be called by an Admin account.
    function bridgeDonation(
        address sender,
        uint256 amount,
        string calldata homeTX
    ) external;

    //// VIEW FUNCTIONS:

    /// @notice Returns the value of the nominator used by the mint ratio.
    /// @return The value of the nominator
    function numerator() external view returns (uint256);

    /// @notice Returns the value of the denominator used by the mint ratio.
    /// @return The value of the denominator
    function denominator() external view returns (uint256);

    /// @notice Returns the value of the mint ratio calculated as fixed point division of NUMERATOR/DENOMINATOR.
    /// @return The calculated value of the ratio
    function ratio() external view returns (uint256);

    /// @notice Returns the current membership dues.
    /// @return The membership dues
    function membershipDues() external view returns (uint256);

    /// @notice Returns the address of the token manager contract.
    /// @return The address of the token manager contract
    function tokenManager() external view returns (address);

    /// @notice Returns the address of the registry contract.
    /// @return The address of the registry contract
    function registry() external view returns (address);

    /// @notice Returns the address of the token contract.
    /// @return The address of the token contract
    function token() external view returns (address);

    /// @notice Returns the address of the bridge.
    /// @return The address of the bridge
    function bridgeAddress() external view returns (address);
}
