// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "../lib/AdminRole.sol";

contract AdminRoleMock is AdminRole {
    function initialize(address[] calldata _accounts) public initializer {
        __AdminRole_init(_accounts);
    }
}
