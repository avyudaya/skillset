// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Organization.sol";
import "./Employee.sol";

contract Admin {
    address public owner;

    mapping(address => address) registeredEmployeesmap;
    mapping(address => address) registeredOrganizationmap;
    address[] registeredEmployees;
    address[] registeredOrganization;

    // for search by name
    mapping(string => address) empsmap;
    mapping(string => address) orgsmap;
    string[] emps;
    string[] orgs;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function createEmployee(
        address _eth_address,
        string memory _name,
        string memory _location,
        string memory _description
    ) public {
        Employee emp = new Employee(
            owner,
            _eth_address,
            _name,
            _description,
            _location
        );
        registeredEmployeesmap[_eth_address] = address(emp);
        registeredEmployees.push(_eth_address);
        // adding to search array
        empsmap[_name] = _eth_address;
    }

    function createOrganization(
        address _eth_address,
        string memory _name,
        string memory _location,
        string memory _description
    ) public onlyOwner {
        Organization org = new Organization(
            owner,
            _eth_address,
            _name,
            _description,
            _location
        );
        registeredOrganizationmap[_eth_address] = address(org);
        registeredOrganization.push(_eth_address);
        // adding to search array
        orgsmap[_name] = _eth_address;
    }

    function isEmployee(address _employee_address) public view returns (bool) {
        return registeredEmployeesmap[_employee_address] != address(0x0);
    }

    function isOrganization(
        address _organization_address
    ) public view returns (bool) {
        return registeredOrganizationmap[_organization_address] != address(0x0);
    }

    function employeeCount() public view returns (uint256) {
        return registeredEmployees.length;
    }

    function getEmployeeContractByAddress(
        address _employee
    ) public view returns (address) {
        return registeredEmployeesmap[_employee];
    }

    function getEmployeeContractByIndex(
        uint256 index
    ) public view returns (address) {
        return getEmployeeContractByAddress(registeredEmployees[index]);
    }

    function OrganizationCount() public view returns (uint256) {
        return registeredOrganization.length;
    }

    function getOrganizationContractByAddress(
        address _organization
    ) public view returns (address) {
        return registeredOrganizationmap[_organization];
    }

    function getOrganizationContractByIndex(
        uint256 index
    ) public view returns (address) {
        return getOrganizationContractByAddress(registeredOrganization[index]);
    }

    // search emps or orgs by name

    function getOrganizationByName(string memory _name) public view returns (address) {
      return orgsmap[_name];
    }

    function getEmployeesByName(string memory _name) public view returns (address) {
      return empsmap[_name];
    }

}
