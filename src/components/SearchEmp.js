import {
    Card,
    useToast,
    Text,
    CardBody,
    CardHeader,
    Heading,
    LinkBox,
    Box,
    LinkOverlay,
    Divider,
    Progress,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Admin from "../abis/Admin.json";
  import Employee from "../abis/Employee.json";

  export default function SearchEmp({ emp }) {
    const [loading, setLoading] = useState("");
    const [employeeData, setEmployeeData] = useState({});
    const toast = useToast();
  
    const loadBlockChainData = async () => {
      setLoading(true);
      const empAddress = emp;
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        const employeeContractAddress = await admin.methods
          ?.getEmployeeContractByAddress(empAddress)
          .call();
        const EmployeeContract = await new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );
        const employeedata = await EmployeeContract.methods
          .getEmployeeInfo()
          .call();
        const newEmployedata = {
          ethAddress: employeedata[0],
          name: employeedata[1],
          location: employeedata[3],
          description: employeedata[2],
        };
  
        setEmployeeData(newEmployedata);
      } else {
        toast({
          title: "The Admin Contract does not exist on this network!",
          status: "error",
          isClosable: true,
        });
      }
      setLoading(false);
    };
  
    useEffect(() => {
      const func = async () => {
        await loadBlockChainData();
      };
  
      func();
    }, []);
  
  
    return (
      loading? <Progress size='xs' isIndeterminate />:
      <LinkBox py={4} pb={0}>
        <Heading size="md" my="2">
          <LinkOverlay href={'/employee/'+employeeData.ethAddress}>{employeeData.name}</LinkOverlay>
        </Heading>
            <Text fontSize={"sm"} fontWeight={"300"}>
              {employeeData?.location}
            </Text>
        <Text color="gray.400" mb={2}>{employeeData.description}</Text>
        <Divider/>
      </LinkBox>
    );
  }
  