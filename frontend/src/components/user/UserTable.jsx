import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search, X } from "lucide-react";
import UserDeviceModal from "./UserDeviceModal";
import { CgAddR } from "react-icons/cg";
import { toast } from "react-toastify";
import axios from "axios";

const UserTable = ({ userData, isDataChanged, setIsDataChanged }) => {
  const user = userData.data;
  const userId = user.id;
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [relays, setRelays] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log(`isDataChanged: ${isDataChanged}`);
  }, [isDataChanged]);

  const handleDeleteDevice = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/api/UserDevice/delete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: deleteFormData,
        }
      );

      if (response.status === 200) {
        setIsDataChanged(true);
        toast.success("Device deleted successfully");
        document.getElementById("delete_modal").close();
      } else {
        throw new Error("Failed to delete box");
      }
    } catch (error) {
      toast.error("Error deleting device: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const responses = await Promise.all([
          fetch(`${import.meta.env.VITE_SERVER_URI}/api/Relay/getall`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_SERVER_URI}/api/Sensor/getall`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_SERVER_URI}/api/Box/getall`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_SERVER_URI}/api/Organisation/getall`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [
          relayResponse,
          sensorResponse,
          boxResponse,
          organizationResponse,
        ] = await Promise.all(responses.map((res) => res.json()));

        if (relayResponse.success) {
          setRelays(relayResponse.data);
        }
        if (sensorResponse.success) {
          setSensors(sensorResponse.data);
        }
        if (boxResponse.success) {
          setBoxes(boxResponse.data);
        }
        if (organizationResponse.success) {
          setOrganizations(organizationResponse.data);
        }
      } catch (error) {
        toast.error("Error loading data: " + error.message);
      }
    };

    fetchData();
  }, [isDataChanged]);

  const fetchAllDevices = useCallback(async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/api/UserDevice/getall`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllDevices(response.data.data);
    } catch (error) {
      toast.error("Error loading all devices: " + error.message);
    }
  }, [isDataChanged]);

  useEffect(() => {
    if (userData) {
      fetchAllDevices();
    }
  }, [userData, fetchAllDevices]);

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem("jwtToken");
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Device/getdevicesbyuserId?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setDevices(data.data);
      } catch (error) {
        toast.error("Error loading devices: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [userId, isDataChanged]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    const results = devices.filter((device) => {
      const boxNameMatch =
        device.box?.name.toLowerCase().includes(term) ?? false;
      const relayMatch =
        device.relays?.some((relay) =>
          relay.name.toLowerCase().includes(term)
        ) ?? false;
      const sensorMatch =
        device.sensors?.some((sensor) =>
          sensor.name.toLowerCase().includes(term)
        ) ?? false;

      return boxNameMatch || relayMatch || sensorMatch;
    });

    setFilteredDevices(results);
  }, [searchTerm, devices]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSave = async (requestBody) => {
    const token = localStorage.getItem("jwtToken");

    try {
      const deviceExists = filteredDevices.some(
        (device) =>
          device.relays.some((relay) => relay.id === requestBody.deviceId) ||
          device.sensors.some((sensor) => sensor.id === requestBody.deviceId)
      );

      if (deviceExists) {
        toast.error("You cannot add the same device twice.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/UserDevice/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setIsDataChanged(true);
      toast.success("Device added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error adding device: " + error.message);
    }
  };

  const [deleteFormData, setDeleteFormData] = useState({
    id: null,
    userId: null,
    deviceId: null,
    deviceTypeId: null,
    boxId: null,
  });

  useEffect(() => {
    if (selectedDevice) {
      setDeleteFormData(selectedDevice);
    }
  }, [selectedDevice]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {isModalOpen && (
        <UserDeviceModal
          allDevices={allDevices}
          userDevices={devices}
          sensors={sensors}
          relays={relays}
          organizations={organizations}
          boxes={boxes}
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-square rounded-lg"
        >
          <CgAddR />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search devices..."
            className="bg-gray-700 text-white w-36 sm:w-48 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      {/* TABLE */}
      <div className="overflow-x-auto h-usertable">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Box Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredDevices.flatMap((device) => [
              ...device.relays.map((relay) => (
                <motion.tr
                  key={`relay-${relay.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {relay.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {device.box.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Relay
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        relay.active
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {relay.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => {
                        const device = allDevices.find(
                          (d) =>
                            d.deviceId === relay.id &&
                            d.deviceTypeId === relay.deviceTypeId &&
                            d.userId === userId
                        );
                        if (device) {
                          setSelectedDevice({
                            id: device.id,
                            userId: device.userId,
                            deviceId: device.deviceId,
                            deviceTypeId: device.deviceTypeId,
                            boxId: device.boxId,
                          });
                          document.getElementById("delete_modal").showModal();
                        } else {
                          console.error("Device not found.");
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              )),
              ...device.sensors.map((sensor) => (
                <motion.tr
                  key={`sensor-${sensor.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {sensor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {device.box.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Sensor
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sensor.active
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {sensor.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => {
                        const device = allDevices.find(
                          (d) =>
                            d.deviceId === sensor.id &&
                            d.deviceTypeId === sensor.deviceTypeId &&
                            d.userId === userId
                        );
                        if (device) {
                          setSelectedDevice({
                            id: device.id,
                            userId: device.userId,
                            deviceId: device.deviceId,
                            deviceTypeId: device.deviceTypeId,
                            boxId: device.boxId,
                          });
                          document.getElementById("delete_modal").showModal();
                        } else {
                          console.error("Device not found.");
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this device?
          </h3>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => document.getElementById("delete_modal").close()}
              className="btn btn-outline btn-accent px-4 py-2 flex items-center gap-2 mt-4 mr-3"
            >
              <X />
              <span className="hidden sm:inline">Close</span>
            </button>
            <button
              className="btn btn-outline btn-error mt-4"
              onClick={() => handleDeleteDevice()}
            >
              <Trash2 /> Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => document.getElementById("delete_modal").close()}
          >
            Close
          </button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default UserTable;
