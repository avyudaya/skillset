import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Stack,
    StackDivider,
    Text,
    Badge,
    Link
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  import Employee from "../abis/Employee.json";
  import Loading from "./Loading";
  
  export default function EmployeeCard({ address }) {
    const [employeeData, setEmployeeData] = useState({});
    const [skills, setskills] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [workExps, setWorkExps] = useState([]);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const loadBlockChainData = async () => {
      const web3 = window.web3;
      const EmployeeContract = await new web3.eth.Contract(Employee.abi, address);
  
      await getSkills(EmployeeContract);
      await getCertifications(EmployeeContract);
      await getWorkExps(EmployeeContract);
      await getEducations(EmployeeContract);
  
      const employeedata = await EmployeeContract.methods
        .getEmployeeInfo()
        .call();
      const newEmployedata = {
        ethAddress: employeedata[0],
        name: employeedata[1],
        location: employeedata[3],
        description: employeedata[2],
        email: employeedata[4]
      };
      setEmployeeData(newEmployedata);
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
          endorser_address: certi[1],
          experience: certi[2],
          endorsed: certi[3],
        });
        return;
      });
      setskills(newskills);
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
          endorsed: certi[3]
        });
        return;
      });
      setCertifications(newcertifications);
    }
  
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
          endorsed: work[4],
          description: work[5]
        });
        return;
      });
  
      setWorkExps(newworkExps)
    }
  
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
      setEducations(neweducation);
    }
  
    useEffect(() => {
      const func = async () => {
        setLoading(true);
        await loadBlockChainData();
      };
  
      func();
    }, []);
  
    return loading ? (
      <Loading />
    ) : (
      <Card width={{ base: "sm", md: "2xl", sm: "md", lg: "3xl" }}>
        <Link href={'/employee/'+employeeData?.ethAddress}>
        <CardHeader pb={0}>
          <Heading size="md">
            {employeeData?.name}
          </Heading>
          <Text>
          {employeeData?.ethAddress}  
          </Text>
        </CardHeader>
        </Link>
  
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs">Location: {employeeData?.location}</Heading>
              <Heading size="xs">Email: {employeeData?.email}</Heading>
              <Text pt="2" fontSize="sm">
                {employeeData?.description}
              </Text>
            </Box>
            {skills.length > 0 && (
              <Box>
                <Heading size="xs" mb={2}>Skills</Heading>
                <Stack direction="row">
                  {
                    skills.map((skill, index) => (
                      skill.endorsed? <Badge key={index} variant='solid' colorScheme='green'>{skill?.name}</Badge>:
                      <Badge key={index}>{skill?.name}</Badge>
                    ))
                  }
                </Stack>
              </Box>
            )}
            {certifications.length > 0 && (
              <Box>
                <Heading size="xs" mb={2}>Certifications</Heading>
                <Stack direction="row">
                  {
                    certifications.map((certi, index) => (
                      certi.endorsed? <Badge key={index} variant='solid' colorScheme='green'>{certi?.name}</Badge>:
                      <Badge key={index}>{certi?.name}</Badge>
                    ))
                  }
                </Stack>
              </Box>
            )}
            {workExps.length > 0 && (
              <Box>
                <Heading size="xs" mb={2}>Work Experiences</Heading>
                <Stack direction="row">
                  {
                    workExps.map((w, index) => (
                      w.endorsed? <Badge key={index} variant='solid' colorScheme='green'>{w?.role}</Badge>:
                      <Badge key={index}>{w?.role}</Badge>
                    ))
                  }
                </Stack>
              </Box>
            )}
            {educations.length > 0 && (
              <Box>
                <Heading size="xs" mb={2}>Educations</Heading>
                <Stack direction="row">
                  {
                    educations.map((edu, index) => (
                      edu.endorsed? <Badge key={index} variant='solid' colorScheme='green'>{edu?.description}</Badge>:
                      <Badge key={index}>{edu?.description}</Badge>
                    ))
                  }
                </Stack>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>
    );
  }
  