// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

interface IMintable {
    function mint(address _who, uint256 _value) external;
}