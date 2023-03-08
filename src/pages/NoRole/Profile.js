import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  Textarea,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { messageAdmin } from "../../firebase/api";
import Admin from "../../abis/Admin.json";
export default function Profile() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isNameError = name === "";
  const isLocationError = location === "";
  const isDescriptionError = description === "";
  const isRoleError = role === 0;

  const handleNameChange = (e) => setName(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);

  const toast = useToast();

  const handleSubmit = async (e) => {
    setLoading(true);
    setSubmitted(true);

    if (
      isNameError ||
      isLocationError ||
      isDescriptionError ||
      isRoleError
    ) {
      setLoading(false);
      return;
    }

    const info = {
      name: name,
      description: description,
      location: location,
    };

    if (role === "1") {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];

      if(AdminData){
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        
        try {
          await admin.methods.createEmployee(
            accounts[0],
            name,
            location,
            description
          ).send({ from: accounts[0] });
          window.location.reload(true);
        } catch (err) {
          toast({
            title: err.message,
            status: "error",
            isClosable: true,
          });
        }
      }

    } else {
      await messageAdmin(info);
      toast({
        title: "Message sent to admin.",
        status: "success",
        isClosable: true,
      });
    }

    setName("");
    setDescription("");
    setRole(0);
    setLocation("");
    setSubmitted(false);
    setLoading(false);
  };

  return (
    <VStack spacing={10} mx={0} px={0}>
      <VStack width={{ base: "sm", md: "2xl", sm: "md" }}>
        <Heading as="h3" variant="md" mt={1.5} mb={6}>
          Sign Up
        </Heading>

        <FormControl isRequired isInvalid={isNameError && submitted}>
          <FormLabel mb={4}>Name</FormLabel>
          <Input type="text" value={name} onChange={handleNameChange} />
          {submitted ? (
            isNameError ? (
              <FormErrorMessage>Name Required</FormErrorMessage>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={isLocationError && submitted}>
          <FormLabel mb={4}>Location</FormLabel>
          <Input type="text" value={location} onChange={handleLocationChange} />
          {submitted ? (
            isLocationError ? (
              <FormErrorMessage>Location Required</FormErrorMessage>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={isRoleError && submitted}>
          <FormLabel>Role</FormLabel>
          <Select
            placeholder="Select role"
            value={role}
            onChange={handleRoleChange}
          >
            <option value={1}>Employee</option>
            <option value={2}>Organization</option>
          </Select>
          {submitted ? (
            isRoleError ? (
              <FormErrorMessage>Role Required</FormErrorMessage>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </FormControl>

        <FormControl isRequired isInvalid={isDescriptionError && submitted}>
          <FormLabel mb={4}>Description</FormLabel>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Provide a short description about yourself."
            size="sm"
          />
          {submitted ? (
            isDescriptionError ? (
              <FormErrorMessage>Description Required</FormErrorMessage>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </FormControl>
      </VStack>
      <Button
        colorScheme="pink"
        bgGradient="linear(to-r, pink.400, pink.500, pink.600)"
        color="white"
        variant="solid"
        type="submit"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}
