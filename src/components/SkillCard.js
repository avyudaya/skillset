import {
    Card,
    Stack,
    Modal,
    Text,
    CardBody,
    CircularProgress,
    CircularProgressLabel,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    CardFooter,
    HStack,
  } from "@chakra-ui/react";
  import { CheckCircleIcon } from "@chakra-ui/icons";
  import { Link } from "react-router-dom";
  export default function SkillCard({ skill, reqEndorsement }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <>
        <Link as="button" onClick={onOpen}>
          <Card
            size="sm"
            p={3}
            direction={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="start"
          >
            <Stack>
              <CardBody>
                <Text
                  fontSize={"lg"}
                  fontWeight={"500"}
                  textTransform="uppercase"
                >
                  {skill?.name} &nbsp;
                  {skill?.endorsed ? (
                    <CheckCircleIcon color="green"></CheckCircleIcon>
                  ) : (
                    <></>
                  )}
                </Text>
              </CardBody>
            </Stack>
          </Card>
        </Link>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {skill?.name}&nbsp;
              {skill?.endorsed ? (
                <CheckCircleIcon color="green"></CheckCircleIcon>
              ) : (
                <></>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              pb={6}
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Text>{skill?.experience}</Text>
            </ModalBody>
  
            {reqEndorsement && (
              <ModalFooter>
                <Button colorScheme="pink" mr={3}>
                  Request Endorsement
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  