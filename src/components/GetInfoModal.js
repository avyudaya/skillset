import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalContent,
  Button,
  ModalHeader,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import Organization from "../abis/Organization.json";
import Skills from "../abis/Skills.json";

export default function GetInfoModal({
  isOpen,
  onClose,
  info,
  sender,
  admin,
  org,
  isEndorsementReq,
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createUser = async (e) => {
    e.preventDefault();
    const { ethAddress, name, location, description, email } = info;
    if (!name || !location || !description || !ethAddress) {
      toast({
        title: "Please fill all the fields!",
        status: "error",
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    setErrorMessage("");

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);

      const owner = await admin.methods.owner().call();
      if (owner !== accounts[0]) {
        setErrorMessage("Sorry! You are not the Admin!");
        setLoading(false);
        return;
      }
      try {
        await admin.methods
          .createOrganization(ethAddress, name, location, email, description)
          .send({ from: accounts[0] });
        // TODO delete the chat form firebase
        toast({
          title: "New organization registered succressfully!",
          status: "success",
          isClosable: true,
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    onClose();
  };

  const endorseEmployee = async () => {
    const { req } = info;
    var section = -1;
    if (req === "Education Endorsement Request") section = 1;
    else if (req === "Certification Endorsement Request") section = 2;
    else if (req === "Work Experience Endorsement Request") section = 3;
    if (req === "Skill Endorsement Request") section = 4;

    setLoading(true);
    setErrorMessage("");

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const SkillData = await Skills.networks[networkId];

    if (AdminData && SkillData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);

      try {
        const employeeContractAddress = await admin.methods
          .getEmployeeContractByAddress(info?.ethAddress)
          .call();
        const EmployeeContract = await new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );

        if (section === 1) {
          await EmployeeContract.methods
            ?.endorseEducation()
            .send({ from: accounts[0] });
        } else if (section === 2) {
          await EmployeeContract?.methods
            ?.endorseCertification(info.name)
            .send({ from: accounts[0] });
        } else if (section === 3) {
          if (info?.current === true) {
            // add it to the organization companies
            const orgContractAddress = await admin?.methods
              ?.getOrganizationContractByAddress(info.organization)
              .call();
            const orgContract = await new web3.eth.Contract(
              Organization.abi,
              orgContractAddress
            );
            await orgContract?.methods
              ?.addEmployees(sender)
              .send({ from: accounts[0] });
            console.log("add to company");
          }
          await EmployeeContract?.methods
            ?.endorseWorkExp()
            .send({ from: accounts[0] });
        } else if (section === 4) {
          await EmployeeContract?.methods
            ?.endorseSkill(info.name)
            .send({ from: accounts[0] });
          const skills = await new web3.eth.Contract(
            Skills.abi,
            SkillData.address
          );
          await skills?.methods
            ?.addEmployeeToSkill(info.name, sender)
            .send({ from: accounts[0] });
        }

        toast({
          title: "Endorsed successfully!",
          status: "success",
          isClosable: true,
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    onClose();
  };

  return isEndorsementReq ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{info?.req}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {info?.req === "Skill Endorsement Request" && (
            <>
              <Text>Name: {info?.name}</Text>
              <Text>Organization: {info?.organization}</Text>
              <Text>Description: {info?.description}</Text>
              <Text>Experience: {info?.experience}</Text>
            </>
          )}
          {info?.req === "Certification Endorsement Request" && (
            <>
              <Text>Name: {info?.name}</Text>
              <Text>Organization: {info?.organization}</Text>
              <Text>Score: {info?.score}</Text>
            </>
          )}
          {info?.req === "Education Endorsement Request" && (
            <>
              <Text>Institute: {info?.institute}</Text>
              <Text>Description: {info?.description}</Text>
              <Text>Start Date: {info?.startdate}</Text>
              <Text>End Date: {info?.enddate}</Text>
            </>
          )}
          {info?.req === "Work Experience Endorsement Request" && (
            <>
              <Text>Name: {info?.role}</Text>
              <Text>Organization: {info?.organization}</Text>
              <Text>Description: {info?.description}</Text>
              <Text>Start Date: {info?.startdate}</Text>
              {info?.current === true ? (
                <Text>Current</Text>
              ) : (
                <Text>End Date: {info?.enddate}</Text>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {org && (
            <Button
              colorScheme="pink"
              bgGradient="linear(to-r, pink.400, pink.500, pink.600)"
              color="white"
              variant="solid"
              mr={3}
              isLoading={loading}
              onClick={endorseEmployee}
            >
              Endorse
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : info?.ethAddress ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Role Requested</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>Name: {info?.name}</Text>
          <Text color="gray.400" fontWeight={300}>
            {info?.ethAddress}
          </Text>
          <Text>Location: {info?.location}</Text>
          <Text>Description: {info?.description}</Text>
          <Text>Role requested: Organization</Text>
          <Text>Location: {info?.location}</Text>
          <Link href={"mailto:" + info?.email} color="teal.500">
            {info?.email}
          </Link>
          <br></br>
          <Link
            isExternal
            color="teal.500"
            href={"https://gateway.pinata.cloud/ipfs/" + info?.fileCID}
          >
            Verification Document <ExternalLinkIcon mx="2px" />
          </Link>
        </ModalBody>

        <ModalFooter>
          {admin && (
            <Button
              colorScheme="pink"
              bgGradient="linear(to-r, pink.400, pink.500, pink.600)"
              color="white"
              variant="solid"
              mr={3}
              isLoading={loading}
              onClick={createUser}
            >
              Create
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : (
    <></>
  );
}
