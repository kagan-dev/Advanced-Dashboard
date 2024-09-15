import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header";
import ConnectedAccounts from "../../components/user/ConnectedAccounts";
import DangerZone from "../../components/user/DangerZone";
import Profile from "../../components/user/Profile";
import Security from "../../components/user/Security";
import UserTable from "../../components/user/UserTable";
import UserAuth from "../../components/user/UserAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../lib/utils/functions/Layout";
const UserPage = () => {
  const { userName } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const handleGetUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage.");
        setError("No JWT token found.");
        setLoading(false);
        toast.error("Oturum açma token'ı bulunamadı.");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/api/User/getbyusername?user_name=${userName}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("User fetched successfully:", response.data);
          setIsDataChanged(false); // Reset data changed flag
          setUserData(response.data);
          // toast.success("Kullanıcı başarıyla getirildi!");
        } else {
          console.error("Failed to get user");
          setError("Failed to fetch user data.");
          toast.error("Kullanıcı verileri getirilemedi.");
        }

        console.log("API Yanıtı:", response.data);
        console.log("Kullanıcı Adı Parametresi:", userName);
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response);
          console.error("Validation errors:", error.response.data.errors);
          toast.error("Kullanıcı verileri alınırken bir hata oluştu.");
        } else {
          console.error("Error message:", error.message);
          toast.error("Bir hata meydana geldi: " + error.message);
        }
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    handleGetUser();
  }, [userName, isDataChanged]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title={`${userData.data.fullName}'s Profile`} />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <Profile userData={userData} />
        <Layout>
          <UserTable
            userData={userData}
            isDataChanged={isDataChanged}
            setIsDataChanged={setIsDataChanged}
          />
          <UserAuth userData={userData} />
          <DangerZone userData={userData} />
        </Layout>

        {/* <Security />
        <ConnectedAccounts /> */}
      </main>
    </div>
  );
};

export default UserPage;
