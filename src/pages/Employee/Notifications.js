import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.js";
import Admin from "../../abis/Admin.json";
import {
  Card,
  Link,
  Image,
  Heading,
  useToast,
  VStack,
  Stack,
  CardBody,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import NoChat from "../../components/NoChat";
import ChatBody from "../../components/ChatBody";

export default function Notifications() {
  const [curr, setCurr] = useState({});
  const [conversations, setConversations] = useState([]);
  const [admin, setAdmin] = useState("");
  var colour = ["b6e498", "61dafb", "764abc", "83cd29", "00d1b2"];
  const toast = useToast();

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    await db
      .collection("users")
      .doc(accounts[0])
      .collection("activechats")
      .onSnapshot((snapshot) =>
        setConversations(snapshot.docs.map((doc) => doc.data()))
      );

    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const owner = await admin?.methods?.owner().call();
      setAdmin(owner);
    } else {
      toast({
        title: "The Admin Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }
  };

  const genImg = (name) => {
    return `https://ui-avatars.com/api/?background=${
      colour[Math.floor(Math.random() * 5)]
    }&color=fff&name=${name}`;
  };

  const setCurrent = (data) => {
    const curr = {
      ...data,
      avatar: genImg(data.name),
    };
    setCurr(curr);
  };

  useEffect(() => {
    const func = async () => {
      await loadBlockChainData();
    };
    func();
  }, []);

  return (
    <VStack width="80%">
      <Heading as="h3" variant="md" mt={1.5} mb={6}>
        Notifications
      </Heading>
      <Grid
        templateColumns="repeat(12, 1fr)"
        templateRows="repeat(6,1fr)"
        gap={0}
        width="100%"
      >
        {conversations.length > 0 && <GridItem colSpan={{base: 12, md: 3}}>
          <Card
            size="sm"
            direction={{ base: "row", sm: "column" }}
            overflow="hidden"
            variant="outline"
          >
            {conversations?.map((data) => {
              return (
                <Link
                  key={data.ethAddress}
                  as="button"
                  onClick={() => setCurrent(data)}
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                >
                  <Image
                    objectFit="cover"
                    width={20}
                    height={20}
                    minHeight={20}
                    minWidth={20}
                    src={genImg(data.name)}
                    alt="Caffe Latte"
                  />
                  <Stack textAlign='left'>
                    <CardBody>
                      <Heading size="md">{data.name}</Heading>
                    </CardBody>
                  </Stack>
                </Link>
              );
            })}
          </Card>
        </GridItem>}
        <GridItem colSpan={{base: 12, md: conversations.length > 0 ? 9: 12}} rowSpan={6}>
          {curr.ethAddress ? (
            <ChatBody
              name={curr.name}
              ethAddress={curr.ethAddress}
              avatar={curr.avatar}
              key={curr.ethAddress}
              isEndorsementReq={curr.ethAddress !== admin}
              org
            />
          ) : (
            <NoChat />
          )}
        </GridItem>
      </Grid>
    </VStack>
  );
}
