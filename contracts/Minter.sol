// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {AddressUpgradeable as Address} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import {OwnableUpgradeable as Ownable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IMinter.sol";
import "./interfaces/IRegistry.sol";
import "./interfaces/IMintable.sol";

contract Minter is Ownable, IMinter {
    using Address for address payable;

    uint256 private constant MAX_TRUST_DENOMINATOR = 10000000; // TODO: convention says: 100*1e18

    //// STORAGE:

    IRegistry internal registryContract;
    IERC20 internal tokenContract;

    address internal bridge;
    address internal tokenManagerContract;

    uint256 internal membershipDuesVal;
    uint256 internal numeratorVal;
    uint256 internal denominatorVal;

    modifier onlyBridge() {
        if (_msgSender() != bridge) revert SenderMustBeBridge();
        _;
    }

    function initialize(
        address _bridge,
        address _tokenManager,
        address _registry,
        address _tokenContract
    ) external initializer {
        __Ownable_init();
        bridge = _bridge;
        tokenManagerContract = _tokenManager;
        registryContract = IRegistry(_registry);
        tokenContract = IERC20(_tokenContract);
    }

    //
    // ADMIN FUNCTIONS:
    //

    /// @notice Set the address of the token manager that mints the tokens.
    /// @dev Must be called by the Owner
    /// @param _tokenManager The new Token Manager contract address
    function setTokenManagerContract(address _tokenManager) external onlyOwner {
        if (_tokenManager == address(0)) revert AddressMustBeNonZero();
        tokenManagerContract = _tokenManager;
        emit TokenManagerContractChanged(tokenManagerContract, msg.sender);
    }

    /// @notice Set the address of the token contract.
    /// @dev Must be called by the Owner.
    /// @param _token The new token contract address
    function setTokenContract(address _token) external onlyOwner {
        if (_token == address(0)) revert AddressMustBeNonZero();
        tokenContract = IERC20(_token);
        emit TokenContractChanged(_token, msg.sender);
    }

    /// @notice Set the address of the Registry.
    /// @dev Must be called by the Owner
    /// @param _registry The new Registry contract address
    function setRegistry(address _registry) external onlyOwner {
        if (_registry == address(0)) revert AddressMustBeNonZero();
        registryContract = IRegistry(_registry);
        emit RegistryContractChanged(_registry, msg.sender);
    }

    /// @notice Set the ratio (numerator/denominator) used for minting calculation.
    /// @dev Can only be called by the Owner.
    /// @param _numerator The ratio numerator
    /// @param _denominator The ratio denominator
    function setRatio(uint256 _numerator, uint256 _denominator)
        external
        onlyOwner
    {
        if (_denominator == 0) revert DenominatorMustBeNonZero();
        numeratorVal = _numerator;
        denominatorVal = _denominator;
        emit RatioChanged(numeratorVal, denominatorVal);
    }

    /// @notice Set the membership dues that need to be donated to actvate a membership.
    /// @dev Can only be called by the Owner.
    /// @param _amount The amount to set the new dues to
    function setMembershipDues(uint256 _amount) external onlyOwner {
        membershipDuesVal = _amount;
        emit MembershipDuesChanged(_amount, msg.sender);
    }

    /// @notice Set the address of the Bridge.
    /// @dev Must be called by the Owner
    /// @param _bridge The new Registry contract address
    function setBridge(address _bridge) external onlyOwner {
        if (_bridge == address(0)) revert AddressMustBeNonZero();
        bridge = _bridge;
        emit BridgeChanged(bridge, msg.sender);
    }

    //
    // EXTERNAL FUNCTIONS:
    //
    /// @notice Bridge a donation transaction to the minter contract.
    /// The donation will call ethe underlying mnt function.
    /// @dev Can only be called by the bridge.
    function bridgeDonation(
        address sender,
        uint256 amount,
        string calldata homeTX
    ) external onlyBridge {
        _mint(sender, amount);
        emit DonationBridged(sender, amount, homeTX);
    }

    //
    // VIEW FUNCTIONS:
    //

        /// @notice Returns the value of the nominator used by the mint ratio.
    /// @return The value of the nominator
    function numerator() external view returns (uint256) {
        return numeratorVal;
    }

    /// @notice Returns the value of the denominator used by the mint ratio.
    /// @return The value of the denominator
    function denominator() external view returns (uint256) {
        return denominatorVal;
    }

    /// @notice Returns the value of the mint ratio calculated as fixed point division of NUMERATOR/DENOMINATOR.
    /// @return The calculated value of the ratio
    function ratio() external view returns (uint256) {
        return numeratorVal / denominatorVal;
    }

    /// @notice Returns the current membership dues.
    /// @return The membership dues
    function membershipDues() external view returns (uint256) {
        return membershipDuesVal;
    }

    /// @notice Returns the address of the token manager contract.
    /// @return The address of the token manager contract
    function tokenManager() external view returns (address) {
        return tokenManagerContract;
    }

    /// @notice Returns the address of the token contract.
    /// @return The address of the token contract
    function token() external view returns (address) {
        return address(tokenContract);
    }

    /// @notice Returns the address of the registry contract.
    /// @return The address of the registry contract
    function registry() external view returns (address) {
        return address(registryContract);
    }

    /// @notice Returns the address of the bridge.
    /// @return The address of the bridge
    function bridgeAddress() external view returns (address) {
        return bridge;
    }

    //
    // INTERNAL FUNCTIONS:
    //
    function _mint(address recipient, uint256 amount) internal {
        uint256 toMint;
        // Get the max trust amount for the recipient acc from the Registry.
        uint256 maxTrust = registryContract.getMaxTrust(recipient);

        // Get the current token balance of the recipient account.
        uint256 recipientBalance = IERC20(tokenContract).balanceOf(recipient);

        // Check if we are not an active member:
        // Active members must have token balance.
        if (recipientBalance == 0) {
            // If we are not an active member, check if our application is approved.
            // Application is approved if we have a maxTrust score.
            if (maxTrust > 0) {
                // Check if the deposit is greather than membership dues.
                if (amount >= membershipDuesVal) {
                    // If we did pay membership dues, activate the membership:
                    // Add any pending balance to the mint amount and clear the value.
                    uint256 pendingBalance = registryContract.getPendingBalance(
                        recipient
                    );

                    // Mint amount: donation * ratio + pending balance.
                    toMint =
                        ((amount * numeratorVal) / denominatorVal) +
                        pendingBalance;

                    // Clear the pending balance.
                    if (pendingBalance > 0) {
                        registryContract.clearPendingBalance(recipient);
                    }
                }
            }
            // If we don't have a membership application, or we did not donate enough to cover dues
            // there is nothing else to do.
            return;
        } else {
            // Amount to mint is the donation * ratio.
            toMint = (amount * numeratorVal) / denominatorVal;
        }

        // Determine the maximum supply of the token.
        uint256 totalSupply = tokenContract.totalSupply();

        // The recipient cannot receive more than the following amount of tokens:
        // maxR := maxTrust[recipient] * TOTAL_SUPPLY / 10000000.
        uint256 maxToReceive = (maxTrust * totalSupply) / MAX_TRUST_DENOMINATOR;

        // If the recipient is to receive more than this amount of tokens, reduce
        // mint the difference.
        if (maxToReceive <= recipientBalance + toMint) {
            toMint = maxToReceive - recipientBalance;
        }

        // If there is anything to mint, mint it to the recipient.
        if (toMint > 0) {
            IMintable(tokenManagerContract).mint(recipient, toMint);
        }
    }

    //
    // EVENTS:
    //

    /// @dev Event emitted when the bridge address is changed
    /// @param bridge The new bridge address
    /// @param sender The admin account that made the change
    event BridgeChanged(address bridge, address sender);

    /// @dev Event emitted when a donation is bridged.
    /// @param sender The account that sent the donation
    /// @param amount The amount donated
    /// @param homeTX The transaction being bridged
    event DonationBridged(
        address indexed sender,
        uint256 amount,
        string homeTX
    );

    /// @dev Event emitted when the mint ratio is changed
    /// @param nominator The new nominator value
    /// @param denominator The new denominator value
    event RatioChanged(uint256 nominator, uint256 denominator);

    /// @dev Event emitted when the mebership dues are changed.
    /// @param amount The new memebership dues
    /// @param admin The admin account that made the change
    event MembershipDuesChanged(uint256 amount, address admin);

    /// @dev Event emitted when the Token Manager contract is changed
    /// @param tokenManagerContract The address of the new Token Manager contract
    /// @param admin The admin account that made the change
    event TokenManagerContractChanged(
        address tokenManagerContract,
        address admin
    );

    /// @dev Event emitted when the token contract is changed
    /// @param tokenContract The address of the new Token contract
    /// @param admin The admin account that made the change
    event TokenContractChanged(address tokenContract, address admin);

    /// @dev Event emitted when the Registry contract is changed
    /// @param registryContract The address of the new Registry contract
    /// @param admin The admin account that made the change
    event RegistryContractChanged(address registryContract, address admin);

    //
    // ERRORS;
    //

    error SenderMustBeBridge();
    error AddressMustBeNonZero();
    error DenominatorMustBeNonZero();
}
