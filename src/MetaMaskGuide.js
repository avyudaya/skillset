import { Box, Heading, Button, Spacer, Link } from "@chakra-ui/react";

export default function MetaMaskGuide() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, pink.400, pink.600)"
        backgroundClip="text"
      >
        Error
      </Heading>
      <Heading as="h5" size="md" mt={3} mb={6}>
        Metamask is not installed
      </Heading>
      <Spacer></Spacer>
      <Link href="https://metamask.io/download/" isExternal>
        <Button
          colorScheme="pink"
          bgGradient="linear(to-r, pink.400, pink.500, pink.600)"
          color="white"
          variant="solid"
        >
          Download
        </Button>
      </Link>
    </Box>
  );
}
