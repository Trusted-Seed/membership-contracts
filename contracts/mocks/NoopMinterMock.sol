// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "../Minter.sol";

contract NoopMinterMock is Minter {
    event NoopMinted(address beneficiary, uint256 amount);

    constructor(
        address owner,
        address bridge,
        address tokenManager,
        address registry,
        address token
    ) {
        _initialize(owner, bridge, tokenManager, registry, token);
    }

    function _mint(address recipient, uint256 amount) internal override {
        emit NoopMinted(recipient, amount);
    }
}
