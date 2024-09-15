import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignupPage";
import OverviewPage from "./pages/overview/OverviewPage";
import Sidebar from "./components/common/Sidebar";
import UsersPage from "./pages/users/UsersPage";
import BoxesPage from "./pages/boxes/BoxesPage";
import UserPage from "./pages/users/UserPage";
import OrganizationsPage from "./pages/organizations/OrganizationsPage";
import RelaysPage from "./pages/relays/RelaysPage";
import SensorsPage from "./pages/sensors/SensorsPage";
import AuthorityPage from "./pages/authority/AuthorityPage";

function App() {
  const location = useLocation();

  const isLogoutPage = location.pathname === "/logout";

  const logout = () => {
    setTimeout(() => {
      localStorage.removeItem("jwtToken");
      toast.success("Başarıyla çıkış yapıldı!");
    }, 1000);
  };

  if (isLogoutPage) {
    logout();
    return <Navigate to="/login" replace />;
  }

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const checkAuth = () => {
    const token = localStorage.getItem("jwtToken");
    if (token === null && !isAuthPage) {
      toast.error("Lütfen giriş yapın!");
    }
    return token !== null;
  };

  if (!checkAuth() && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }
  if (checkAuth() && isAuthPage) {
    toast.info("Zaten giriş yapmış durumdasınız!");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isAuthPage ? (
        <div className="flex max-w-6xl mx-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      ) : (
        <>
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br opacity-80 " />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>
          <Sidebar />
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/boxes" element={<BoxesPage />} />
            <Route path="/users/:userName" element={<UserPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/relays" element={<RelaysPage />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/authority" element={<AuthorityPage />} />
          </Routes>
        </>
      )}
      <ToastContainer autoClose={4000} /> /
    </div>
  );
}

export default App;
