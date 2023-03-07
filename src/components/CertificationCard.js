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
    useToast,
  } from "@chakra-ui/react";
  import { reqCertiEndorsementFunc } from "../firebase/api";
  import { CheckCircleIcon } from "@chakra-ui/icons";
  import { Link } from "react-router-dom";
  import { useState } from "react";
  
  export default function CertificationCard({ certi, reqEndorsement }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [submitted, setSubmitted] = useState(false);
  
    const toast = useToast();
  
    const requestCertiEndorsement = async (e) => {
      setSubmitted(true);
      onClose();
      var x = reqCertiEndorsementFunc(certi, toast);
      if(x){
        toast({
          title: "Endorsement request sent!",
          status: "success",
          isClosable: true,
        });
        setSubmitted(false);
      }
      onClose();
    };
  
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
                  {certi?.name} &nbsp;
                  {certi?.endorsed ? (
                    <CheckCircleIcon color="green"></CheckCircleIcon>
                  ) : (
                    <></>
                  )}
                </Text>
              </CardBody>
            </Stack>
            <CircularProgress value={certi?.score} size="60px">
              <CircularProgressLabel>{certi?.score}</CircularProgressLabel>
            </CircularProgress>
          </Card>
        </Link>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {certi?.name}&nbsp;
              {certi?.endorsed ? (
                <CheckCircleIcon color="green"></CheckCircleIcon>
              ) : (
                <></>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              pb={6}
              display="flex"
              flexDir="column"
              justifyContent="center"
              alignItems="start"
            >
              <div>
              <Text>Org Address:</Text>
              <Text mb={6}>{certi?.organization}</Text>
              </div>
              Score:
              <CircularProgress value={certi?.score} size="60px" mt={4}>
                <CircularProgressLabel>
                  {certi?.score}
                </CircularProgressLabel>
              </CircularProgress>
            </ModalBody>
  
            {reqEndorsement && (
              <ModalFooter>
                <Button
                  colorScheme="pink"
                  mr={3}
                  onClick={requestCertiEndorsement}
                  isLoading={submitted}
                >
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
  