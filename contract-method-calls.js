var contract = artifacts.require("Admin");

module.exports = function () {
  async function getAdmin() {
    const admin = await contract.deployed();
    console.log(admin.address);
  }

  async function isEmployee(address){
    const admin = await contract.deployed();
    const val = await admin.isEmployee(address)
    console.log(val);
  }

  async function createEmployee(address, name, location, description){
    const admin = await contract.deployed();
    const emp = await admin.createEmployee(address, name, location, description);
    console.log(emp);
  }

  getAdmin();
  // isEmployee('0x0d359f09cF38E48E20404CaB055bBE472cd77307');
  // createEmployee('0x0d359f09cF38E48E20404CaB055bBE472cd77307','Avyudaya Acharya', 'Balaju', 'react developer')
};
