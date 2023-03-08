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
import axios from "axios";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NDNiZWQ5Ni1hZTBmLTRlNjEtOTA2ZS00OGQxNmM3YTE0N2QiLCJlbWFpbCI6ImF2eXVkYXlhMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNTY5ZjNlM2ZjY2RkNjhkNzgyMTAiLCJzY29wZWRLZXlTZWNyZXQiOiIxOTgyYzM3NTdjNDhjOGY0MzFkNjg0ZDZkMTAzMjA3MGNiMWU3ZDkzNjI3MjBhODQ3M2QzMjY3YWQ3ZmI3YTc2IiwiaWF0IjoxNjc4MjY1OTMwfQ.hvE04O_JTWzQnleO7_JE5rl5Kjlt0--xzn64Jr7NrPs`;
export default function Profile() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("0");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const isNameError = name === "";
  const isLocationError = location === "";
  const isDescriptionError = description === "";
  const isRoleError = role === "0";
  const isFileError = selectedFile === undefined;

  const handleNameChange = (e) => setName(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleRoleChange = (e) => {
    if (e.target.value === "") setRole('1');
    else setRole(e.target.value);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      return res.data?.IpfsHash;
    } catch (error) {
      console.log(error);
    }
  };

  const toast = useToast();

  const handleSubmit = async (e) => {
    setLoading(true);
    setSubmitted(true);

    if (
      isNameError ||
      isLocationError ||
      isDescriptionError ||
      isRoleError ||
      (isFileError && role === '2')
    ) {
      setLoading(false);
      return;
    }

    if (role === "1") {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];

      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);

        try {
          await admin.methods
            .createEmployee(accounts[0], name, location, description)
            .send({ from: accounts[0] });
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
      const fileCID = await handleSubmission();
      const info = {
        name: name,
        description: description,
        location: location,
        fileCID: fileCID
      };
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
            <option value="1">Employee</option>
            <option value="2">Organization</option>
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

        {role === "2" && <FormControl isRequired isInvalid={isFileError && submitted}>
          <FormLabel mb={4}>Validation Document</FormLabel>
          <Input type="file" onChange={changeHandler} />
          {submitted && isFileError && (
              <FormErrorMessage>File Required</FormErrorMessage>
            )}
        </FormControl>}
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
