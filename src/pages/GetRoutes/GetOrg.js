import { Heading, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Admin from "../../abis/Admin.json";
import Organization from "../../abis/Organization.json";
import Loading from "../../components/Loading";
import OrganizationCard from "../../components/OrganizationCard";
import EmployeeCard from "../../components/EmployeeCard";
import { useParams } from "react-router-dom";


export default function GetOrg() {
  let { org_address } = useParams();
  const [orgContractAddress, setOrgContractAddress] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false)
  const toast = useToast();

  const getEmployees = async () => {
    setLoading(true)
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();

    const AdminData = await Admin.networks[networkId];

    if (!org_address) {
      return;
    }

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const orgContractAddress = await admin?.methods
        ?.getOrganizationContractByAddress(org_address)
        .call();
      const orgContract = await new web3.eth.Contract(
        Organization.abi,
        orgContractAddress
      );

      const employeeCount = await orgContract?.methods?.totalEmployees().call();

      const employees = await Promise.all(
        Array(parseInt(employeeCount))
          .fill()
          .map(async (ele, index) => {
            const employee = await orgContract?.methods
              ?.getEmployeeByIndex(index)
              .call();
            return admin.methods.getEmployeeContractByAddress(employee).call();
          })
      );

      setEmployees(employees);
      setOrgContractAddress(orgContractAddress);
    } else {
      toast({
        title: "The Admin Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }

    setLoading(false)
  };

  useEffect(() => {
    const func = async () => {
      await getEmployees();
    };
    func();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <VStack spacing={2}>
      {orgContractAddress && <OrganizationCard address={orgContractAddress} showLink={false} />}
      {employees.length > 0 && (
        <>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            p={6}
            fontSize={{ base: "xl", sm: "2xl", lg: "3xl" }}
          >
            All employees in Organization
          </Heading>
          {employees?.map((employee, index) => (
            <EmployeeCard key={index} address={employee} />
          ))}
        </>
      )}
    </VStack>
  );
}
