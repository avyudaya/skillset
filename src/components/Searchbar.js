import { SearchIcon } from "@chakra-ui/icons";
import _ from "lodash";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  Input,
  Box,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Hotkeys from "react-hot-keys";
import Admin from "../abis/Admin.json";
import Skills from "../abis/Skills.json";
import SearchEmp from "./SearchEmp";
import SearchOrg from "./SearchOrg";

var source = [];

export default function Searchbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState();
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");

  const toast = useToast();

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const SkillData = await Skills.networks[networkId];

    if (AdminData && SkillData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const skills = await new web3.eth.Contract(Skills.abi, SkillData.address);
      const empsCount = await admin?.methods?.employeeCount().call();
      const orgsCount = await admin?.methods?.OrganizationCount().call();

      //search logic employees
      const allEmps = await Promise.all(
        Array(parseInt(empsCount))
          .fill()
          .map((ele, index) =>
            admin.methods?.getEmployeeNameByIndex(index).call()
          )
      );
      allEmps.forEach(async (empName) => {
        const currEmpLen = await admin?.methods
          ?.getTotalEmployeeInEmpsByName(empName)
          .call();
        const allEmp = await Promise.all(
          Array(parseInt(currEmpLen))
            .fill()
            .map((ele, index) =>
              admin?.methods?.getEmployeesByName(empName, index).call()
            )
        );
        allEmp.forEach((emp, index) => {
          source.push({
            address: emp,
            title: empName,
            skill: '',
            description: <SearchEmp emp={emp} key={index} />,
          });
        });
      });

      // search logic organizations
      const allOrgs = await Promise.all(
        Array(parseInt(orgsCount))
          .fill()
          .map((ele, index) =>
            admin.methods?.getOrganizationNameByIndex(index).call()
          )
      );
      allOrgs.forEach(async (orgName, index) => {
        const org = await admin?.methods?.getOrganizationByName(orgName).call();
        source.push({
          address: org,
          tittle: orgName,
          skill: '',
          description: <SearchOrg org={org} key={index} />,
        });
      });
      //search endosed skills
    } else {
      toast({
        title: "The Admin Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }


    // searching skills

    if (SkillData) {
      const skills = await new web3.eth.Contract(Skills.abi, SkillData.address);
      const skillLength = await skills?.methods?.getSkillLength().call();
      const allSkills = await Promise.all(
        Array(parseInt(skillLength))
          .fill()
          .map((ele, index) => skills.methods?.getSkillsByIndex(index).call())
      );

      allSkills.forEach(async (skillname) => {
        const currSkillLen = await skills.methods
          ?.getTotalEmployeeInSkillByName(skillname)
          .call();
        const allEmp = await Promise.all(
          Array(parseInt(currSkillLen))
            .fill()
            .map((ele, index) =>
              skills.methods?.getEmployeeBySkillName(skillname, index).call()
            )
        );

        if(source.filter(e => e.address === allEmp[0]).length){
          var i = source.findIndex(x => x.address === allEmp[0])
          source[i].skill += skillname+" ";
        }
      });
    } else {
      toast({
        title: "The Skill Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }

    console.log(source);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
    setLoading(true);

    if (e.target.value < 1) {
      setResults([]);
      return;
    }

    const re = new RegExp(_.escapeRegExp(value), "i");
    const isMatch = (result) => re.test(result.skill) || re.test(result.title);

    setLoading(false);
    setResults(_.filter(source, isMatch));
  };

  const handelSearchClose = (e) => {
    setLoading(false);
    setValue("");
    setResults([]);
    onClose();
  };

  useEffect(() => {
    const func = async () => {
      await loadBlockChainData();
    };
    func();
  }, []);

  return (
    <>
      <Hotkeys
        keyName="ctrl+shift+f"
        onKeyDown={(keyName, e, handle) => {
          onOpen();
        }}
      />

      <Button onClick={onOpen}>
        <SearchIcon />
      </Button>
      <Box display={{ base: "none", lg: "flex" }}>/ Ctrl+Shift+f</Box>

      <Modal isOpen={isOpen} onClose={handelSearchClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={6}>
            <FormControl>
              <Input
                placeholder="Search for employees or organizations or skills"
                onChange={handleSearchChange}
                value={value}
                autoComplete="off"
              />
            </FormControl>
            {results.length > 0 ? (
              results.map((emp, index) => (
                <Box key={index}>{emp.description}</Box>
              ))
            ) : value.length > 0 ? (
              <Box p={6}>
                <Text textAlign="center">Nothing Found. Try something different.</Text>
              </Box>
            ) : (
              <></>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
