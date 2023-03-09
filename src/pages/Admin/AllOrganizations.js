import { useEffect, useState } from "react";
import Admin from "../../abis/Admin.json";
import OrganizationCard from "../../components/OrganizationCard";
import Loading from "../../components/Loading";
import { Text, Heading, SimpleGrid, useToast, VStack } from "@chakra-ui/react";

export default function AllOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState([]);
  const toast = useToast();

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const organizationCount = await admin?.methods
        .OrganizationCount()
        .call();

      const organizations = await Promise.all(
        Array(parseInt(organizationCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getOrganizationContractByIndex(index).call()
          )
      );

      setOrganizations(organizations);
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
        All Organizations
      </Heading>
      {organizations.length > 0 ? <SimpleGrid
        columns={1}
        spacing={10}
        alignItems="center"
        justifyContent="center"
      >
        {organizations.map((organization, index) => (
          <OrganizationCard key={index} address={organization} showLink={true}/>
        ))}
      </SimpleGrid>: <Text>No organizations registered in the blockchain.</Text>}
    </VStack>
  );
}
