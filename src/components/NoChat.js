import { Card, CardBody, Text } from "@chakra-ui/react";

export default function NoChat() {
    return <Card height="63vh" width="100%" textAlign="center">
    <CardBody display='flex' justifyContent='center' alignItems='center'>
      <Text>
        Click on Profiles to start chatting.
      </Text>
    </CardBody>
  </Card>
}