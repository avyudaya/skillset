import {
    useToast,
    Text,
    Heading,
    LinkBox,
    LinkOverlay,
    Divider,
    Progress,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Admin from "../abis/Admin.json";
  import Organization from "../abis/Organization.json";
  import Loading from './Loading'
  
  export default function SearchOrg({ org }) {
    const [loading, setLoading] = useState("");
    const [orgData, setOrgData] = useState({});
    const toast = useToast();
  
    const loadBlockChainData = async () => {
      setLoading(true);
      const orgAddress = org;
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        const orgContractAddress = await admin.methods
          ?.getOrganizationContractByAddress(orgAddress)
          .call();
        const OrganizationContract = await new web3.eth.Contract(
          Organization.abi,
          orgContractAddress
        );
        const orgData = await OrganizationContract.methods
          .getOrganizationInfo()
          .call();
        const newOrganizationData = {
          ethAddress: orgData[1],
          name: orgData[0],
          location: orgData[3],
          description: orgData[2]
        };
  
        setOrgData(newOrganizationData);
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
  
  
    return ( loading? <Progress size='xs' isIndeterminate />:
      <LinkBox py={4} pb={0}>
        <Heading size="md" my="2">
          <LinkOverlay href={'/organization/'+orgData.ethAddress}>{orgData.name}: Organization</LinkOverlay>
        </Heading>
            <Text fontSize={"sm"} fontWeight={"300"}>
              {orgData?.location}
            </Text>
          
        <Text color="gray.400" mb={2}>{orgData.description}</Text>
        <Divider/>
      </LinkBox>
    );
  }
  