import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import UsersTable from "../../components/users/UsersTable";
import UserPageSkeleton from "../../lib/utils/skeletons/pages/UserPageSkeleton";
import Layout from "../../lib/utils/functions/Layout";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found");
        setError("User is not authenticated");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/User/getall`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch users");
        }

        const data = await response.json();
        console.log("Received data:", data);
        setUsers(data.data);
        setIsDataChanged(false); // Reset data changed flag
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isDataChanged]);

  // const activeUsers = users.filter((user) => user.active === 1).length;
  // const passiveUsers = users.filter((user) => user.active === 0).length;
  // const percentageActiveUsers = (
  //   (users.filter((user) => user.active === 1).length / users.length) *
  //   100
  // ).toFixed(2);
  // const percentagePassiveUsers = (
  //   (users.filter((user) => user.active === 0).length / users.length) *
  //   100
  // ).toFixed(2);

  return (
    <div className="flex-1 overflow-auto relative z-10 min-h-screen">
      <Header title="Users" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading && <UserPageSkeleton />} {/* Yüklenme durumu */}
        {error && <p className="text-red-500">Error: {error}</p>}{" "}
        {/* Hata durumu */}
        {!loading && !error && (
          <>
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {/* <StatCard
                name="Total Users"
                icon={UsersIcon}
                value={users.length}
                color="#6366F1"
              />
              <StatCard
                name="Active Users Percentage"
                icon={UserPlus}
                value={`%${percentageActiveUsers}`}
                color="#10B981"
              />
              <StatCard
                name="Passive Users Percentage"
                icon={UserCheck}
                value={`%${percentagePassiveUsers}`}
                color="#F59E0B"
              />
              <StatCard
                name="Active Users"
                icon={UserX}
                value={activeUsers}
                color="#EF4444"
              /> */}
            </motion.div>
            <Layout>
              <UsersTable
                users={users}
                isDataChanged={isDataChanged}
                setIsDataChanged={setIsDataChanged}
              />
            </Layout>

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <UserGrowthChart />
              <UserActivityHeatmap />
              <UserDemographicsChart />
            </div> */}
          </>
        )}
      </main>
    </div>
  );
};

export default UsersPage;
