// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Employee {
  address admin;
  address employee_address;
  string description;
  string location;
  string name;
  string email;

  constructor(
    address _admin,
    address _employee_address,
    string memory _name,
    string memory _description,
    string memory _location,
    string memory _email
  ) {
    admin = _admin;
    name = _name;
    employee_address = _employee_address;
    description = _description;
    location = _location;
    email = _email;
  }

  modifier OnlyEmployee() {
    require(msg.sender == employee_address);
    _;
  }

  function getEmployeeInfo()
    public
    view
    returns (
      address,
      string memory,
      string memory,
      string memory,
      string memory
    )
  {
    return (employee_address, name, description, location, email);
  }

   /*********************************************************SKILL SECTION**********************************************************/

  struct skillInfo {
    string name;
    address organization;
    string experience;
    bool endorsed;
  }

  mapping(string => skillInfo) skillmap;
  string[] skills;

  function addskill(
    string memory _name,
    address _organization,
    string memory _experience
  ) public OnlyEmployee {
    skillInfo memory newskillInfo;
    newskillInfo.name = _name;
    newskillInfo.organization = _organization;
    newskillInfo.experience = _experience;
    newskillInfo.endorsed = false;
    skillmap[_name] = newskillInfo;
    skills.push(_name);
  }

  function endorseSkill(string memory _name) public {
    require(msg.sender == skillmap[_name].organization);
    skillmap[_name].endorsed = true;
  }

  function getSkillByName(string memory _name)
    private
    view
    returns (
      string memory,
      address,
      string memory,
      bool
    )
  {
    return (
      skillmap[_name].name,
      skillmap[_name].organization,
      skillmap[_name].experience,
      skillmap[_name].endorsed
    );
  }

  function getSkillCount() public view returns (uint256) {
    return skills.length;
  }

  function getskillByIndex(uint256 _index)
    public
    view
    returns (
      string memory,
      address,
      string memory,
      bool
    )
  {
    return getSkillByName(skills[_index]);
  }

  /*********************************************************CERTIFICATION SECTION**********************************************************/

  struct certificationInfo {
    string name;
    address organization;
    uint256 score;
    bool endorsed;
  }

  mapping(string => certificationInfo) certificationmap;
  string[] certifications;

  function addCertification(
    string memory _name,
    address _organization,
    uint256 _score
  ) public OnlyEmployee {
    certificationInfo memory newcertificationInfo;
    newcertificationInfo.name = _name;
    newcertificationInfo.organization = _organization;
    newcertificationInfo.score = _score;
    newcertificationInfo.endorsed = false;
    certificationmap[_name] = newcertificationInfo;
    certifications.push(_name);
  }

  function endorseCertification(string memory _name) public {
    require(msg.sender == certificationmap[_name].organization);
    certificationmap[_name].endorsed = true;
  }

  function getCertificationByName(string memory _name)
    private
    view
    returns (
      string memory,
      address,
      uint256,
      bool
    )
  {
    return (
      certificationmap[_name].name,
      certificationmap[_name].organization,
      certificationmap[_name].score,
      certificationmap[_name].endorsed
    );
  }

  function getCertificationCount() public view returns (uint256) {
    return certifications.length;
  }

  function getCertificationByIndex(uint256 _index)
    public
    view
    returns (
      string memory,
      address,
      uint256,
      bool
    )
  {
    return getCertificationByName(certifications[_index]);
  }

  /********************************************************************Work Experience Section********************************************************************/

  struct workexpInfo {
    string role;
    address organization;
    string startdate;
    string enddate;
    bool endorsed;
    bool current;
    string description;
  }

  mapping(address => workexpInfo) workexpmap;
  address[] workexps;

  function addWorkExp(
    string memory _role,
    address _organization,
    string memory _startdate,
    string memory _enddate,
    bool _current,
    string memory _description
  ) public OnlyEmployee {
    workexpInfo memory newworkexp;
    newworkexp.role = _role;
    newworkexp.organization = _organization;
    newworkexp.startdate = _startdate;
    newworkexp.enddate = _enddate;
    newworkexp.endorsed = false;
    newworkexp.description = _description;
    newworkexp.current = _current;
    workexpmap[_organization] = newworkexp;
    workexps.push(_organization);
  }

  function endorseWorkExp() public {
    require(workexpmap[msg.sender].organization != address(0x0));
    workexpmap[msg.sender].endorsed = true;
  }

  function getWorkExpByAddress(address _organization)
    private
    view
    returns (
      string memory,
      address,
      string memory,
      string memory,
      bool,
      bool,
      string memory
    )
  {
    return (
      workexpmap[_organization].role,
      workexpmap[_organization].organization,
      workexpmap[_organization].startdate,
      workexpmap[_organization].enddate,
      workexpmap[_organization].current,
      workexpmap[_organization].endorsed,
      workexpmap[_organization].description
    );
  }

  function getWorkExpCount() public view returns (uint256) {
    return workexps.length;
  }

  function getWorkExpByIndex(uint256 _index)
    public
    view
    returns (
      string memory,
      address,
      string memory,
      string memory,
      bool,
      bool,
      string memory
    )
  {
    return getWorkExpByAddress(workexps[_index]);
  }

  /********************************************************************Education Section********************************************************************/

  struct educationInfo {
    address institute;
    string startdate;
    string enddate;
    bool endorsed;
    string description;
  }

  mapping(address => educationInfo) educationmap;
  address[] educations;

  function addEducation(
    address _institute,
    string memory _startdate,
    string memory _enddate,
    string memory _description
  ) public OnlyEmployee {
    educationInfo memory newEducation;
    newEducation.institute = _institute;
    newEducation.startdate = _startdate;
    newEducation.enddate = _enddate;
    newEducation.endorsed = false;
    newEducation.description = _description;
    educationmap[_institute] = newEducation;
    educations.push(_institute);
  }

  function endorseEducation() public {
    require(educationmap[msg.sender].institute != address(0x0));
    educationmap[msg.sender].endorsed = true;
  }

  function getEducationByAddress(address _institute)
    private
    view
    returns (
      address,
      string memory,
      string memory,
      bool,
      string memory
    )
  {
    return (
      educationmap[_institute].institute,
      educationmap[_institute].startdate,
      educationmap[_institute].enddate,
      educationmap[_institute].endorsed,
      educationmap[_institute].description
    );
  }

  function getEducationCount() public view returns (uint256) {
    return educations.length;
  }

  function getEducationByIndex(uint256 _index)
    public
    view
    returns (
      address,
      string memory,
      string memory,
      bool,
      string memory
    )
  {
    return getEducationByAddress(educations[_index]);
  }
}

