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

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
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
            title: empName,
            description: <SearchEmp emp={emp} key={index}/>
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
          tittle: orgName,
          description: <SearchOrg org={org} key={index}/>
        })
      })
      //search endosed skills
    } else {
      toast({
        title: "The Admin Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }
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
    const isMatch = (result) => re.test(result.title);

    setLoading(false);
    setResults(_.filter(source, isMatch));
    console.log(results);
  };

  const handelSearchClose = (e) => {
    setLoading(false);
    setValue('')
    setResults([])
    onClose()
  }
  
  useEffect(() => {
    const func = async () => {
      await loadBlockChainData();
    };

    const handelSearchClose = (e) => {
      setLoading(false);
      setValue("");
      setResults([]);
      onClose();
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
              />
            </FormControl>
            {results.length > 0 && results.map((emp, index) => <div key={index}>{emp.description}</div>)}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
