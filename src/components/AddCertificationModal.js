import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
    Button,
    FormErrorMessage,
    useToast,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import Admin from "../abis/Admin.json";
  import Employee from "../abis/Employee.json";
  
  export default function AddCertificationModal({ initialRef, isOpen, onClose }) {
    const [name, setName] = useState("");
    const [orgAddress, setorgAddress] = useState("");
    const [score, setScore] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invEth, setInvEth] = useState(false);
  
    const isNameError = name === "";
    const isOrgAddressError = orgAddress === "";
    const isScoreError = score === "";
  
    const handleNameChange = (e) => setName(e.target.value);
    const handleOrgAddressChange = (e) => setorgAddress(e.target.value);
    const handleScoreChange = (e) => setScore(e.target.value);
  
    var isAddress = function (address) {
      // function isAddress(address) {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
      }
      return true;
      // } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      //     // If it's all small caps or all all caps, return "true
      //     return true;
      // }
    };
  
    const toast = useToast();
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitted(true);
      setLoading(true);
  
      if (isNameError || isScoreError || isOrgAddressError) {
        setLoading(false);
        return;
      }
  
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
  
      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        const employeeContractAddress = await admin?.methods
          ?.getEmployeeContractByAddress(accounts[0])
          .call();
  
        const EmployeeContract = await new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );
  
        if (!isAddress(orgAddress)) {
          setInvEth(true);
          setLoading(false);
          setSubmitted(false);
          return;
        }
  
        try {
          await EmployeeContract.methods
            .addCertification(name, orgAddress, score)
            .send({
              from: accounts[0],
            });
          toast({
            title: "Certification saved succressfully!",
            status: "success",
            isClosable: true,
          });
          window.location.reload(true)
        } catch (err) {
          toast({
            title: err.message,
            status: "error",
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "The Admin Contract does not exist on this network!",
          status: "error",
          isClosable: true,
        });
      }
  
      setLoading(false);
      handleClose();
    };
  
    const handleClose = (e) => {
      setName("");
      setorgAddress("");
      setScore("");
      setLoading(false);
      setSubmitted(false);
      onClose();
    };
  
    return (
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Certification</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={isNameError && submitted}>
              <FormLabel>Certification name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Certification name"
                value={name}
                onChange={handleNameChange}
              />
              {submitted && isNameError && (
                <FormErrorMessage>
                  Certification name is required.
                </FormErrorMessage>
              )}
            </FormControl>
  
            <FormControl
              mt={4}
              isRequired
              isInvalid={
                (isOrgAddressError && submitted) || (invEth && !submitted)
              }
            >
              <FormLabel>Organization Address</FormLabel>
              <Input
                placeholder="Organization from which you got the certification"
                value={orgAddress}
                onChange={handleOrgAddressChange}
              />
              {submitted && isOrgAddressError && (
                <FormErrorMessage>
                  Organization address is required.
                </FormErrorMessage>
              )}
  
              {!submitted && invEth ? (
                <FormErrorMessage>Invalid organization eth address.</FormErrorMessage>
              ) : (
                <></>
              )}
            </FormControl>
  
            <FormControl mt={4} isRequired isInvalid={isScoreError && submitted}>
              <FormLabel>Score</FormLabel>
              <Input
                type="number"
                min="1"
                max="100"
                placeholder="Score betweeen 1-100"
                value={score}
                onChange={handleScoreChange}
              />
              {submitted && isScoreError && (
                <FormErrorMessage>Experience is required.</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
  
          <ModalFooter>
            <Button
              colorScheme="pink"
              mr={3}
              onClick={handleSubmit}
              isLoading={loading}
              type="submit"
            >
              Save
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  