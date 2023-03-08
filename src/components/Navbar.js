import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useColorMode,
  Image,
  useDisclosure,
  Text,
  useColorModeValue,
  Stack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import Admin from "../abis/Admin.json";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import logo from "../assets/logo.png";
import Searchbar from "./Searchbar";

const adminLinks = [
  {
    name: "Employees",
    href: "/",
  },
  {
    name: "Organizations",
    href: "/organizations",
  },
  {
    name: "Notifications",
    href: "/notifications",
  },
];
const employeeLinks = [
  {
    name: "Profile",
    href: "/",
  },
  {
    name: "Edit Profile",
    href: "/edit-profile",
  },
  {
    name: "Notifications",
    href: "/notifications",
  },
];
const orgLinks = [
  {
    name: "Profile",
    href: "/",
  },
  {
    name: "Notifications",
    href: "/notifications",
  },
];
const noRoleLinks = [
  {
    name: "Sign Up",
    href: "/",
  },
  {
    name: "Notifications",
    href: "/notifications",
  },
];

const NavLink = ({ name, href }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    as={ReactRouterLink}
    to={href}
  >
    {name}
  </Link>
);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [role, setRole] = useState(-1);
  const [account, setAccount] = useState("");
  const toast = useToast();

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      setAccount(accounts[0]);
    }
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];

    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const isEmployee = await admin?.methods?.isEmployee(accounts[0]).call();
      const isOrganization = await admin?.methods
        ?.isOrganization(accounts[0])
        .call();
      const owner = await admin?.methods?.owner().call();
      var role = -1;
      if (accounts[0] === owner) {
        role = 0;
      } else if (isEmployee) {
        role = 1;
      } else if (isOrganization) {
        role = 2;
      }

      setRole(role);
    } else {
      toast({
        title: "The Admin Contract does not exist on this network!",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const func = async () => {
      await loadBlockChainData();
    };
    func();
  }, []);

  const roles = ["Admin", "Employee", "Organization"];

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="fixed"
        w="100%"
        as="header"
        backgroundColor={
          colorMode === "light"
            ? "rgba(237, 242, 247, 0.7)"
            : "rgba(23, 25, 35, 0.7)"
        }
        zIndex={100}
        backdropFilter="saturate(180%) blur(5px)"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              mr={2}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack>
              <NavLink
                name={
                  <HStack>
                    <Image
                      boxSize="40px"
                      objectFit="cover"
                      src={logo}
                      alt="logo"
                    />
                    <Heading as="h3" size="lg">
                      Skillset
                    </Heading>
                  </HStack>
                }
                href="/"
              ></NavLink>
              <Searchbar />
            </HStack>
          </Flex>

          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {role === 0 &&
                adminLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}

              {role === 1 &&
                employeeLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}

              {role === 2 &&
                orgLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}

              {role === -1 &&
                noRoleLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}
            </HStack>
            <HStack>
              <Text mx={{ base: 0, md: 4 }} fontSize={"md"} color={"gray.400"}>
                {roles[role]}
              </Text>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </HStack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {role === 0 &&
                adminLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}

              {role === 1 &&
                employeeLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}

              {role === 2 &&
                orgLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}

              {role === -1 &&
                noRoleLinks.map((link) => (
                  <NavLink key={link.name} name={link.name} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
