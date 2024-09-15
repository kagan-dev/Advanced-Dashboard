import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import { BarChart2, PieChart, UserCheck, Users } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import OrganizationsTable from "../../components/organizations/OrganizationsTable";
import OverviewPageSkeleton from "../../lib/utils/skeletons/pages/OverviewPageSkeleton";
import OrganizationsChart from "../../components/organizations/OrganizationsChart";
import OrganizationByCityChart from "../../components/organizations/OrganizationByCityChart";
import OrganizationByTypeChart from "../../components/organizations/OrganizationByTypeChart";
import Layout from "../../lib/utils/functions/Layout";

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageUsers: 0,
    totalSessions: 0,
    averageSessions: 0,
  });
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No JWT token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Organisation/getall`,
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
          throw new Error(`Network response was not ok: ${errorText}`);
        }

        const data = await response.json();
        setOrganizations(data.data);
        setIsDataChanged(false); // Reset data changed flag

        // Calculate stats
        const totalUsers = data.data.reduce(
          (acc, org) => acc + org.maxUserCount,
          0
        );
        const totalSessions = data.data.reduce(
          (acc, org) => acc + org.maxSessionCount,
          0
        );
        const averageUsers = data.data.length
          ? totalUsers / data.data.length
          : 0;
        const averageSessions = data.data.length
          ? totalSessions / data.data.length
          : 0;

        setStats({
          totalUsers,
          averageUsers: averageUsers.toFixed(2),
          totalSessions,
          averageSessions: averageSessions.toFixed(2),
        });
      } catch (error) {
        setError(`Failed to fetch organizations: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [isDataChanged]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Organizations" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading && <OverviewPageSkeleton />} {/* Yüklenme durumu */}
        {error && <p className="text-red-500">Error: {error}</p>}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Users"
            icon={Users} // Çoklu kullanıcıları simgelemek için
            value={`${stats.totalUsers}`}
            color="#6366F1"
          />
          <StatCard
            name="Avg. Users"
            icon={UserCheck} // Ortalama kullanıcılar için bir kullanıcı simgesi
            value={`${stats.averageUsers}`}
            color="#10B981"
          />
          <StatCard
            name="Total Sessions"
            icon={BarChart2} // Oturumların toplamını temsil eden bir grafik simgesi
            value={`${stats.totalSessions}`}
            color="#F59E0B"
          />
          <StatCard
            name="Avg. Sessions"
            icon={PieChart} // Ortalama oturumları göstermek için bir pasta grafik simgesi
            value={`${stats.averageSessions}`}
            color="#EF4444"
          />
        </motion.div>
        <Layout>
          <OrganizationsTable
            organizations={organizations}
            isDataChanged={isDataChanged}
            setIsDataChanged={setIsDataChanged}
          />
        </Layout>
        {/* <OrganizationsChart organizations={organizations} /> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <OrganizationByCityChart organizations={organizations} />
          <OrganizationByTypeChart organizations={organizations} />
        </div>
      </main>
    </div>
  );
};

export default OrganizationsPage;
