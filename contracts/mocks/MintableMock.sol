// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import '../interfaces/IMintable.sol';

contract MintableMock is IMintable {
    address public lastCaller;
    address public lastReceiver;
    uint256 public lastAmount;

    event EthReceived(address sender, uint256 amount);
    event Minted(address caller, address who, uint256 value);

    function mint(address _who, uint256 _value) external {
        lastCaller = msg.sender;
        lastReceiver = _who;
        lastAmount = _value;
        emit Minted(msg.sender, _who, _value);
    }

    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }
}
