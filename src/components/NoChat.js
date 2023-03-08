import { Card, CardBody, Text, Image, Heading } from "@chakra-ui/react";
import chatLogo from "../assets/chat-encrypted.png";

export default function NoChat() {
  return (
    <Card height="63vh" width="100%" textAlign="center">
      <CardBody display="flex" flexDir='column' justifyContent="center" alignItems="center">
        <Image boxSize="200px" objectFit="cover" src={chatLogo} alt="logo" />
        <Heading my={2}>Click on Profiles to start chatting.</Heading>
        <Text>The chats are end to end encrypted.</Text>
      </CardBody>
    </Card>
  );
}
