import {
    Card,
    Stack,
    Modal,
    Text,
    CardBody,
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
  import { CheckCircleIcon } from "@chakra-ui/icons";
import { reqWorkexpEndorsementFunc } from "../firebase/api";

  import { Link } from "react-router-dom";
import { useState } from "react";
  export default function WorkExpCard({ workExp, reqEndorsement }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [submitted, setSubmitted] = useState(false);
    const toast = useToast()

    const requestWorkExpEndorsement = async (e) => {
      setSubmitted(true);
      onClose();
      var x = reqWorkexpEndorsementFunc(workExp, toast);
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
          alignItems="center"
          >
            <Stack>
              <CardBody>
                <Text
                  fontSize={"lg"}
                  fontWeight={"500"}
                  textTransform="uppercase"
                >
                  {workExp?.role} &nbsp;
                  {workExp?.endorsed ? (
                    <CheckCircleIcon color="green"></CheckCircleIcon>
                  ) : (
                    <></>
                  )}
                </Text>
              </CardBody>
            </Stack>
            <Text>{workExp?.startdate} to {workExp?.enddate}</Text>
          </Card>
        </Link>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {workExp?.role}&nbsp;
              {workExp?.endorsed ? (
                <CheckCircleIcon color="green"></CheckCircleIcon>
              ) : (
                <></>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              pb={6}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
            >
            <Text>{workExp?.startdate} to {workExp?.enddate}</Text>
              <Text>{workExp?.description}</Text>
            </ModalBody>
  
            {reqEndorsement && (
              <ModalFooter>
                <Button colorScheme="pink" mr={3} onClick={requestWorkExpEndorsement} isLoading={submitted}>
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
  