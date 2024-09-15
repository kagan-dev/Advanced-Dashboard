import { motion } from "framer-motion";

import { AlertCircle, Box, CheckCircle, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import OverviewPageSkeleton from "../../lib/utils/skeletons/pages/OverviewPageSkeleton";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../../components/boxes/SalesTrendChart";
import BoxesTable from "../../components/boxes/BoxesTable";
import Layout from "../../lib/utils/functions/Layout";

const BoxesPage = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true); // Yüklenme durumunu yönetmek için
  const [error, setError] = useState(null); // Hata durumunu yönetmek için
  const [organizations, setOrganizations] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    let isMounted = true; // Bileşenin mount olup olmadığını takip eder

    const fetchBoxes = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No JWT token found.");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Box/getall`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Received boxes data:", data);

        if (isMounted) {
          setBoxes(data.data); // Bileşen mount edilmişse state güncellemesi yapılır
        }
      } catch (error) {
        console.error("Error fetching Boxes:", error.message);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Yükleme durumu güncellenir
        }
      }
    };

    const fetchOrganizations = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No JWT token found.");
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
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Received organizations data:", data);
        setIsDataChanged(false);
        if (isMounted) {
          setOrganizations(data.data); // Bileşen mount edilmişse state güncellemesi yapılır
        }
      } catch (error) {
        console.error("Error fetching Organizations:", error.message);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Yükleme durumu güncellenir
        }
      }
    };

    fetchOrganizations();
    fetchBoxes();

    return () => {
      isMounted = false; // Bileşen unmount olduğunda state güncellemelerini engeller
    };
  }, [isDataChanged]);

  const activeBoxes = boxes.filter((box) => box.active === 1).length;
  // const passiveBoxes = boxes.filter((box) => box.active === 0).length;
  const percentageActiveboxes = (
    (boxes.filter((box) => box.active === 1).length / boxes.length) *
    100
  ).toFixed(2);
  const percentagePassiveboxes = (
    (boxes.filter((box) => box.active === 0).length / boxes.length) *
    100
  ).toFixed(2);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Boxes" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading && <OverviewPageSkeleton />} {/* Yüklenme durumu */}
        {error && <p className="text-red-500">Error: {error}</p>}{" "}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Boxes"
            icon={Box}
            value={boxes.length}
            color="#6366F1"
          />
          <StatCard
            name="Active Boxes"
            icon={CheckCircle}
            value={activeBoxes}
            color="#10B981"
          />
          <StatCard
            name="Active Boxes Percentage"
            icon={PieChart}
            value={`%${percentageActiveboxes}`}
            color="#F59E0B"
          />
          <StatCard
            name="Inactive Boxes Percentage"
            icon={AlertCircle}
            value={`%${percentagePassiveboxes}`}
            color="#EF4444"
          />
        </motion.div>
        <Layout>
          <BoxesTable
            boxes={boxes}
            organizations={organizations}
            isDataChanged={isDataChanged}
            setIsDataChanged={setIsDataChanged}
          />
        </Layout>
        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};
export default BoxesPage;
