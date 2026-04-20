// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstate {
    struct Property {
        uint id;
        string name;
        string location;
        uint price;
        address owner;
        uint latitude;  // Stored as fixed point (multiply by 1e6)
        uint longitude; // Stored as fixed point (multiply by 1e6)
        uint transferCount; // Track number of transfers
    }

    mapping(uint => Property) public properties;
    uint private propertyCounter = 1;

    function registerProperty(
        string memory _name,
        string memory _location,
        uint _price,
        uint _latitude,
        uint _longitude
    ) public returns (uint) {
        uint propertyId = propertyCounter;
        properties[propertyId] = Property(
            propertyId,
            _name,
            _location,
            _price,
            msg.sender,
            _latitude,
            _longitude,
            0  // Initialize transfer count to 0
        );
        propertyCounter++;
        return propertyId;
    }

    function transferProperty(uint _id, address newOwner) public {
        require(properties[_id].owner == msg.sender, "Not owner");
        properties[_id].owner = newOwner;
        properties[_id].transferCount++;
    }

    function getProperty(
        uint _id
    ) public view returns (uint, string memory, string memory, uint, address, uint, uint, uint) {
        Property memory p = properties[_id];
        return (p.id, p.name, p.location, p.price, p.owner, p.latitude, p.longitude, p.transferCount);
    }

    function getNextPropertyId() public view returns (uint) {
        return propertyCounter;
    }

    function getAllProperties(uint _startId, uint _count) public view returns (Property[] memory) {
        Property[] memory result = new Property[](_count);
        uint counter = 0;
        
        for (uint i = _startId; i < propertyCounter && counter < _count; i++) {
            if (properties[i].owner != address(0)) {
                result[counter] = properties[i];
                counter++;
            }
        }
        
        return result;
    }
}
