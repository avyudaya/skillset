import { useState, useEffect } from "react";
import Web3 from "web3/dist/web3.min.js";
import Admin from "./abis/Admin.json";
import MetaMaskGuide from "./MetaMaskGuide";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flex, useToast } from "@chakra-ui/react";
// components
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
// basic get routes
import GetEmp from "./pages/GetRoutes/GetEmp";
import GetOrg from "./pages/GetRoutes/GetOrg";
// admin routes
import AllEmployees from "./pages/Admin/AllEmployees";
import AllOrganizations from "./pages/Admin/AllOrganizations";
import NotificationsAdmin from "./pages/Admin/Notifications";
// employee routes
import EmployeeProfile from "./pages/Employee/Profile";
import NotificationsEmployee from "./pages/Employee/Notifications";
import EditProfile from "./pages/Employee/EditProfile";
// organization routes
import OrganizationProfile from "./pages/Organization/Profile";
import NotificationsOrganization from "./pages/Organization/Notifications";
// norole routes
import NoRoleProfile from "./pages/NoRole/Profile";
import NotificationsNorole from "./pages/NoRole/Notifications";
// exception routes
import NotFound from "./pages/NotFound";

function App() {
  const toast = useToast();
  const [isMeta, setIsMeta] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [account, setAccount] = useState("");
  const [isOrganization, setIsOrganization] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setIsEmployee(isEmployee);
      setIsOrganization(isOrganization);
      setIsOwner(owner === accounts[0]);
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
      setIsMeta(true);
      setLoading(true);
      if (window.ethereum) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        window.web3 = await new Web3(window.ethereum);
        await loadBlockChainData();
      } else if (window.web3) {
        window.web3 = await new Web3(window.web3.currentProvider);
        await loadBlockChainData();
      } else {
        setIsMeta(false);
      }
      setLoading(false);
    };
    func();
  }, []);

  const adminRoutes = () => {
    return (
      <>
        <Route path="/" exact element={<AllEmployees />} />
        <Route path="/organizations" exact element={<AllOrganizations />} />
        <Route path="/notifications" exact element={<NotificationsAdmin />} />
      </>
    );
  };

  const employeeRoutes = () => {
    return (
      <>
        <Route path="/" exact element={<EmployeeProfile />} />
        <Route path="/edit-profile" exact element={<EditProfile />} />
        <Route
          path="/notifications"
          exact
          element={<NotificationsEmployee />}
        />
      </>
    );
  };

  const organizationRoutes = () => {
    return (
      <>
        <Route path="/" exact element={<OrganizationProfile />} />
        <Route
          path="/notifications"
          exact
          element={<NotificationsOrganization />}
        />
      </>
    );
  };

  const noRoleRoutes = () => {
    return (
      <>
        <Route path="/" exact element={<NoRoleProfile />} />
        <Route path="/notifications" exact element={<NotificationsNorole />} />
      </>
    );
  };

  const renderRoutes = () => {
    if (isOwner) return adminRoutes();
    else if (isEmployee) return employeeRoutes();
    else if (isOrganization) return organizationRoutes();
    else return noRoleRoutes();
  };

  return loading ? (
    <Loading />
  ) : isMeta ?? account !== "" ? (
    <BrowserRouter>
      <Navbar />
      <Flex
        p={6}
        flex={1}
        align={"start"}
        justify={"center"}
        marginX="auto"
        mb={15}
        pt={28}
        minHeight="60vh"
      >
        <Routes>
          <Route
            path="/employee/:employee_address"
            exact
            element={<GetEmp />}
          />
          <Route path="/organization/:org_address" exact element={<GetOrg />} />
          {renderRoutes()}
          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Flex>
      <Footer />
    </BrowserRouter>
  ) : (
    <MetaMaskGuide />
  );
}

export default App;
