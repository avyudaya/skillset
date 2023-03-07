// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Organization {
  address admin;
  string name;
  address organization_address;
  string description;
  string location;

  constructor(
    address _admin,
    address _organization_address,
    string memory _name,
    string memory _description,
    string memory _location
  ) {
    admin = _admin;
    name = _name;
    organization_address = _organization_address;
    description = _description;
    location = _location;
  }
}
