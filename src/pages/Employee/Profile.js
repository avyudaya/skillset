import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import {
  Box,
  Container,
  Stack,
  Text,
  Heading,
  SimpleGrid,
  StackDivider,
  useToast,
  Divider,
} from "@chakra-ui/react";
import SkillCard from "../../components/SkillCard";
import CertificationCard from "../../components/CertificationCard";
import WorkExpCard from "../../components/WorkExpCard";
import EducationCard from "../../components/EducationCard";

export default function EmployeePage() {
  const [employeeData, setEmployeeData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workExps, setworkExps] = useState([]);
  const [educations, seteducations] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const loadBlockChainData = async () => {
    setLoading(true);

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      console.log(employeeContractAddress);
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );

      getSkills(EmployeeContract);
      getCertifications(EmployeeContract);
      getWorkExps(EmployeeContract);
      getEducations(EmployeeContract);

      const employeedata = await EmployeeContract.methods
        .getEmployeeInfo()
        .call();
      const newEmployedata = {
        ethAddress: employeedata[0],
        name: employeedata[1],
        location: employeedata[3],
        description: employeedata[2],
        email: employeedata[4],
      };

      setEmployeeData(newEmployedata);
    } else {
      toast({
        title: "The Admin Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const getSkills = async (EmployeeContract) => {
    const skillCount = await EmployeeContract?.methods?.getSkillCount().call();
    const skills = await Promise.all(
      Array(parseInt(skillCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getskillByIndex(index).call()
        )
    );

    var newskills = [];
    skills.forEach((certi) => {
      newskills.push({
        name: certi[0],
        organization: certi[1],
        experience: certi[2],
        endorsed: certi[3],
      });
      return;
    });
    setSkills(newskills);
  };

  const getCertifications = async (EmployeeContract) => {
    const certiCount = await EmployeeContract?.methods
      ?.getCertificationCount()
      .call();

    const certifications = await Promise.all(
      Array(parseInt(certiCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getCertificationByIndex(index).call()
        )
    );

    var newcertifications = [];
    certifications.forEach((certi) => {
      newcertifications.push({
        name: certi[0],
        organization: certi[1],
        score: certi[2],
        endorsed: certi[3],
      });
      return;
    });
    setCertifications(newcertifications);
  };

  const getWorkExps = async (EmployeeContract) => {
    const workExpCount = await EmployeeContract?.methods
      ?.getWorkExpCount()
      .call();
    const workExps = await Promise.all(
      Array(parseInt(workExpCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getWorkExpByIndex(index).call()
        )
    );

    var newworkExps = [];
    workExps.forEach((work) => {
      newworkExps.push({
        role: work[0],
        organization: work[1],
        startdate: work[2],
        enddate: work[3],
        current: work[4],
        endorsed: work[5],
        description: work[6],
      });
      return;
    });

    setworkExps(newworkExps);
  };

  const getEducations = async (EmployeeContract) => {
    const educationCount = await EmployeeContract?.methods
      ?.getEducationCount()
      .call();
    const educations = await Promise.all(
      Array(parseInt(educationCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getEducationByIndex(index).call()
        )
    );
    var neweducation = [];
    educations.forEach((certi) => {
      neweducation.push({
        institute: certi[0],
        startdate: certi[1],
        enddate: certi[2],
        endorsed: certi[3],
        description: certi[4],
      });
      return;
    });
    seteducations(neweducation);
  };

  useEffect(() => {
    const func = async () => {
      await loadBlockChainData();
    };
    func();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Container maxW={"7xl"}>
      <Stack spacing={{ base: 6, md: 10 }} mb={10}>
        <Box as={"header"}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            my={1.5}
            mt={4}
            fontSize={{ base: "xl", sm: "2xl", lg: "3xl" }}
          >
            {employeeData?.name}
          </Heading>
          <Text color="gray.400" fontWeight={300} fontSize={"md"}>
            {employeeData?.ethAddress}
          </Text>
          <Text fontSize={"2xl"} fontWeight={"300"} mb={3}>
            {employeeData?.location}
          </Text>
          <Text fontSize={"2xl"} fontWeight={"300"} mb={3}>
            {employeeData?.email}
          </Text>

          <Text fontSize={"lg"}>{employeeData?.description}</Text>
        </Box>
        <Divider borderColor="gray.600" />

        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={"column"}
          divider={<StackDivider borderColor="gray.600" />}
        >
          <Box>
            <Text
              fontSize={{ base: "16px", lg: "18px" }}
              color="pink.500"
              fontWeight={"500"}
              textTransform={"uppercase"}
              mb={"4"}
            >
              Skills
            </Text>

            {skills.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={10}
              >
                {skills.map((skill, index) => (
                  <SkillCard skill={skill} key={index} reqEndorsement={false} />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No Skills added.</Text>
            )}
          </Box>

          <Box>
            <Text
              fontSize={{ base: "16px", lg: "18px" }}
              color="pink.500"
              fontWeight={"500"}
              textTransform={"uppercase"}
              mb={"4"}
            >
              Certifications
            </Text>

            {certifications.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={10}
              >
                {certifications.map((certi, index) => (
                  <CertificationCard
                    certi={certi}
                    key={index}
                    reqEndorsement={false}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No Certifications added.</Text>
            )}
          </Box>

          <Box>
            <Text
              fontSize={{ base: "16px", lg: "18px" }}
              color="pink.500"
              fontWeight={"500"}
              textTransform={"uppercase"}
              mb={"4"}
            >
              Work Experiences
            </Text>

            {workExps.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={10}
              >
                {workExps.map((w, index) => (
                  <WorkExpCard workExp={w} key={index} reqEndorsement={false} />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No Work Experiences added.</Text>
            )}
          </Box>

          <Box>
            <Text
              fontSize={{ base: "16px", lg: "18px" }}
              color="pink.500"
              fontWeight={"500"}
              textTransform={"uppercase"}
              mb={"4"}
            >
              Educations
            </Text>

            {educations.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={10}
              >
                {educations.map((e, index) => (
                  <EducationCard edu={e} key={index} reqEndorsement={false} />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No Educations added.</Text>
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
