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
  
  export default function AddEducationModal({ initialRef, isOpen, onClose }) {

    const [instAddress, setInstAddress] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invEth, setInvEth] = useState(false);
  
    const isInstAddressError = instAddress === "";
    const isStartDateErr = startDate === "";
    const isEndDateErr = endDate === "";
    const isDescriptionErr = description === "";
  
    const handleInstAddressChange = (e) => setInstAddress(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
  
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
  
      if (
        isInstAddressError &&
        isStartDateErr &&
        isEndDateErr &&
        isDescriptionErr
      ) {
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
  
        if (!isAddress(instAddress)) {
          setInvEth(true);
          setLoading(false);
          setSubmitted(false);
          return;
        }
  
        try {
          await EmployeeContract.methods
            .addEducation(instAddress, startDate, endDate, description)
            .send({
              from: accounts[0],
            });
          toast({
            title: "Education saved succressfully!",
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
      setInstAddress("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setLoading(false);
      setSubmitted(false);
      onClose();
    };
  
    return (
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Education</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          
            <FormControl
              mt={4}
              isRequired
              isInvalid={
                (isInstAddressError && submitted) || (invEth && !submitted)
              }
            >
              <FormLabel>Institution Address</FormLabel>
              <Input
                placeholder="Institute from which you got the certification"
                value={instAddress}
                onChange={handleInstAddressChange}
              />
              {submitted && isInstAddressError && (
                <FormErrorMessage>
                  Organization address is required.
                </FormErrorMessage>
              )}
  
              {!submitted && invEth ? (
                <FormErrorMessage>
                  Invalid organization eth address.
                </FormErrorMessage>
              ) : (
                <></>
              )}
            </FormControl>
  
            <FormControl isRequired isInvalid={isStartDateErr && submitted}>
              <FormLabel>Start Date</FormLabel>
              <Input
                placeholder="Start Date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
              {submitted && isStartDateErr && (
                <FormErrorMessage>Start Date is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={isEndDateErr && submitted}>
              <FormLabel>End Date</FormLabel>
              <Input
                placeholder="End Date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
              {submitted && isEndDateErr && (
                <FormErrorMessage>End Date is required.</FormErrorMessage>
              )}
            </FormControl>
  
            <FormControl
              mt={4}
              isRequired
              isInvalid={isDescriptionErr && submitted}
            >
              <FormLabel>Course name</FormLabel>
              <Input
                placeholder="Course name"
                value={description}
                onChange={handleDescriptionChange}
              />
              {submitted && isDescriptionErr && (
                <FormErrorMessage>Description is required.</FormErrorMessage>
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
  