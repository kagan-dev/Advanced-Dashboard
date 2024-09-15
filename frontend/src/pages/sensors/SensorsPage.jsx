import Header from "../../components/common/Header";
import React, { useState, useEffect } from "react";
import UserPageSkeleton from "../../lib/utils/skeletons/pages/UserPageSkeleton";
import SensorsTable from "../../components/sensors/SensorsTable";
import Layout from "../../lib/utils/functions/Layout";

const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchSensors = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Sensor/getall`,
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
        console.log("Received data:", data);
        setIsDataChanged(false); // Reset data changed flag
        setSensors(data.data);
      } catch (error) {
        console.error("Error fetching sensors:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeviceTypes = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/DeviceType/getall`,
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
        console.log("Received device types:", data);
        setDeviceTypes(data.data);
      } catch (error) {
        console.error("Error fetching device types:", error.message);
        setError(error.message);
      }
    };

    const fetchBoxes = async () => {
      const token = localStorage.getItem("jwtToken");

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
        console.log("Box:", data);
        setBoxes(data.data);
      } catch (error) {
        console.error("Error fetching boxes:", error.message);
        setError(error.message);
      }
    };

    fetchSensors();
    fetchDeviceTypes();
    fetchBoxes();
  }, [isDataChanged]);

  const getDeviceTypeName = (id) => {
    const deviceType = deviceTypes.find((dt) => dt.id === id);
    return deviceType ? deviceType.name : "Unknown";
  };
  const getBoxName = (id) => {
    const box = boxes.find((b) => b.id === id);
    return box ? box.name : "Unknown";
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 min-h-screen">
      <Header title="Sensors" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading && <UserPageSkeleton />}
        {/* Yüklenme durumu */}
        {error && <p className="text-red-500">Error: {error}</p>}{" "}
        {/* Hata durumu */}
        {!loading && !error && (
          <Layout>
            {" "}
            <SensorsTable
              sensors={sensors}
              getDeviceTypeName={getDeviceTypeName}
              getBoxName={getBoxName}
              boxes={boxes}
              deviceTypes={deviceTypes}
              isDataChanged={isDataChanged}
              setIsDataChanged={setIsDataChanged}
            />
          </Layout>
        )}
      </main>
    </div>
  );
};

export default SensorsPage;
