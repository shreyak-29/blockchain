// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstate {
    struct Property {
        uint id;
        string location;
        uint price;
        address owner;
    }

    mapping(uint => Property) public properties;

    function registerProperty(
        uint _id,
        string memory _location,
        uint _price
    ) public {
        properties[_id] = Property(_id, _location, _price, msg.sender);
    }

    function transferProperty(uint _id, address newOwner) public {
        require(properties[_id].owner == msg.sender, "Not owner");

        properties[_id].owner = newOwner;
    }

    function getProperty(
        uint _id
    ) public view returns (uint, string memory, uint, address) {
        Property memory p = properties[_id];

        return (p.id, p.location, p.price, p.owner);
    }
}
