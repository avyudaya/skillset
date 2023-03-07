import { Text, Heading, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Admin from "../../abis/Admin.json";
import EmployeeCard from "../../components/EmployeeCard";
import Loading from "../../components/Loading";

export default function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeCount = await admin?.methods.employeeCount().call();

      const employees = await Promise.all(
        Array(parseInt(employeeCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getEmployeeContractByIndex(index).call()
          )
      );
      setEmployees(employees);
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
      setLoading(true);

      await loadBlockChainData();
    };
    func();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <VStack>
      <Heading as="h3" variant="md" mt={1.5} mb={6}>
        All Employees
      </Heading>
      {employees.length > 0 ? <SimpleGrid
        columns={1}
        spacing={10}
        alignItems="center"
        justifyContent="center"
      >
        {employees.map((employee, index) => (
          <EmployeeCard key={index} address={employee} />
        ))}
      </SimpleGrid>
      : <Text>No employees registered in the blockchain.</Text>}
    </VStack>
  );
}
