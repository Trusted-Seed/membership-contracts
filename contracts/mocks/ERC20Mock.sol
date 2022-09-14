// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import {ERC20Upgradeable as ERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract ERC20Mock is ERC20 {
    function initialize(uint256 initialSupply) external initializer {
        __ERC20_init("ERC20Mock", "Mock");
        _mint(msg.sender, initialSupply);
    }
}