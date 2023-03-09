import { useEffect, useState } from "react";
import Organization from "../abis/Organization.json";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Stack,
    StackDivider,
    Text,
    Link
  } from "@chakra-ui/react";
import Loading from "./Loading";
export default function OrganizationCard({address, showLink}){

    const [orgData, setOrgData] = useState([]);
    const [allEmployees, setAllEmployees] = useState([])

    const loadBlockChainData = async () => {
        const web3 = window.web3;

        const OrganizationContract = await new web3.eth.Contract(
            Organization.abi,
            address
        );

        const organizationData = await OrganizationContract.methods.getOrganizationInfo().call();
        const newOrgData = {
            ethAddress: organizationData[1],
            name: organizationData[0],
            location: organizationData[3],
            description: organizationData[2],
            email: organizationData[4]
        };
        setOrgData(newOrgData);

        const employeeCount = await OrganizationContract.methods.totalEmployees().call();

        const allEmployeesInOrg = await Promise.all(
            Array(parseInt(employeeCount))
                .fill()
                .map((ele, index) =>
                    OrganizationContract.methods.getEmployeeByIndex(index).call()
                )
        );

        setAllEmployees(allEmployeesInOrg);
    }

    useEffect(() => {

        const func = async () => {
            await loadBlockChainData();
        }

        func()
    }, [])

    return (
    <Card width={{ base: "sm", md: "2xl", sm: "md", lg: "3xl" }}>
      {
        showLink ? <Link href={'/organization/'+orgData?.ethAddress}> <CardHeader pb={0}>
        <Heading size="md">
          {orgData?.name}
        </Heading>
        <Text>
        {orgData?.ethAddress}  
        </Text>
      </CardHeader></Link>: 
       <CardHeader pb={0}>
        <Heading size="md">
          {orgData?.name}
        </Heading>
        <Text>
        {orgData?.ethAddress}  
        </Text>
      </CardHeader>
      }
      

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs">Location: {orgData?.location}</Heading>
            <Heading size="xs">Email: {orgData?.email}</Heading>
            <Text pt="2" fontSize="sm">
              {orgData?.description}
            </Text>
            <Text pt="3" fontSize="md">
              Number of Employees: {allEmployees.length > 0? allEmployees.length: 0}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
    )
}