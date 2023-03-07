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
  import { CheckCircleIcon } from "@chakra-ui/icons";
  import { Link } from "react-router-dom";
  import { useState } from "react";
  import { reqEducationEndorsementFunc } from "../firebase/api";
  
  export default function EducationCard({ edu, reqEndorsement }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [submitted, setSubmitted] = useState(false);
    const toast = useToast()
  
    const requestEduEndorsement = async (e) => {
      setSubmitted(true);
      onClose();
      var x = reqEducationEndorsementFunc(edu, toast);
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
                  {edu?.description} &nbsp;
                  {edu?.endorsed ? (
                    <CheckCircleIcon color="green"></CheckCircleIcon>
                  ) : (
                    <></>
                  )}
                </Text>
              </CardBody>
            </Stack>
            <Text>
              {edu?.startdate} to {edu?.enddate}
            </Text>
          </Card>
        </Link>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {edu?.description}&nbsp;
              {edu?.endorsed ? (
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
              <Text>
                {edu?.startdate} to {edu?.enddate}
              </Text>
              <Text>{edu?.institute}</Text>
            </ModalBody>
  
            {reqEndorsement && (
              <ModalFooter>
                <Button colorScheme="pink" mr={3} onClick={requestEduEndorsement} isLoading={submitted}>
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
  