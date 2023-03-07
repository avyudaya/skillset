import {
  Box,
  Container,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Image
} from "@chakra-ui/react";
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <HStack mt={6}>
          <Image boxSize="40px" objectFit="cover" src={logo} alt="logo" />
          <Heading as="h3" size="lg">
            Skillset
          </Heading>
        </HStack>
        <Stack direction={"row"} spacing={6}>
          <Link href={"#"}>Home</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Blog</Link>
          <Link href={"#"}>Contact</Link>
        </Stack>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text>
            © 2023{" "}
            <Link
              href="https://portfolio-avyudaya1.vercel.app/"
              target="_blank"
            >
              Avyudaya Acharya.
            </Link>{" "}
            All rights reserved
          </Text>
          <Text>Made for the ❤️ of new technology</Text>
        </Container>
      </Box>
    </Box>
  );
}
