import { Box, Heading, Text, Button, Spacer } from '@chakra-ui/react';
import { Link as ReactRouterLink  } from "react-router-dom"

export default function NotFound() {
    return (
        <Box textAlign="center" py={10} px={6}>
          <Heading
            display="inline-block"
            as="h2"
            size="2xl"
            bgGradient="linear(to-r, pink.400, pink.600)"
            backgroundClip="text">
            404
          </Heading>
          <Heading as="h5" size="md" mt={3} mb={2}>
            Page Not Found
          </Heading>
          <Text color={'gray.500'} mb={6}>
            The page you're looking for does not seem to exist
          </Text>
          <Spacer ></Spacer>
          <Button
            colorScheme="pink"
            bgGradient="linear(to-r, pink.400, pink.500, pink.600)"
            color="white"
            variant="solid"
            as={ReactRouterLink}
            to="/">
            Go to Home
          </Button>
        </Box>
      );
}