// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "../Minter.sol";

// TODO: why do we use noopminter? 
contract NoopMinterMock is Minter {
    event NoopMinted(address beneficiary, uint256 amount);

    constructor(
        address bridge,
        address tokenManager,
        address registry,
        address token
    ) {
      // TODO: add init
    }

    // TODO: check test cases
    // function _mint(address recipient, uint256 amount) internal override {
    //     emit NoopMinted(recipient, amount);
    // }
}