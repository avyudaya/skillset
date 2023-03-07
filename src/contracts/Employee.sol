// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Employee {
  address admin;
  address employee_address;
  string description;
  string location;
  string name;

  constructor(
    address _admin,
    address _employee_address,
    string memory _name,
    string memory _description,
    string memory _location
  ) {
    admin = _admin;
    name = _name;
    employee_address = _employee_address;
    description = _description;
    location = _location;
  }
}

