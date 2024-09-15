"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Activity, X, Save } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SensorsTable = ({
  sensors = [],
  getDeviceTypeName,
  getBoxName,
  boxes = [],
  deviceTypes,
  isDataChanged,
  setIsDataChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSensors, setFilteredSensors] = useState(sensors);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("isDataChanged:", isDataChanged);
  }, [isDataChanged]);

  // ADD SENSOR FORM DATA
  const [addFormData, setAddFormData] = useState({
    name: "",
    deviceTypeId: "",
    topicStat: "",
    topicRec: "",
    topicRes: "",
    description: "",
    boxId: "",
    pin: "",
    active: 0,
  });

  // ADD SENSOR FETCH
  const handleAddSensor = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/Sensor/add`,
        addFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sensor created successfully");
        setIsDataChanged(true); // Set flag to true to trigger data refetch
        closeAddModal();
      } else {
        toast.error("Failed to create sensor");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.title || "Validation error occurred.");
      } else {
        toast.error("An error occurred while creating the sensor.");
      }
    }
  };

  // ADD MODAL OPEN
  const openAddModal = () => {
    setAddFormData({
      name: "",
      deviceTypeId: "",
      topicStat: "",
      topicRec: "",
      topicRes: "",
      description: "",
      boxId: "",
      pin: "",
      active: 0,
    });
    const modal = document.getElementById("add_sensor_modal");
    if (modal) modal.showModal();
  };

  // ADD MODAL CLOSE
  const closeAddModal = () => {
    const modal = document.getElementById("add_sensor_modal");
    if (modal) modal.close();
    setSelectedSensor(null);
  };

  // ADD HANDLE INPUT CHANGE
  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // UPDATE SENSOR DATA
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: "",
    deviceTypeId: null,
    topicStat: "",
    topicRec: "",
    topicRes: "",
    description: "",
    boxId: null,
    pin: "",
    active: 0,
  });

  // UPDATE SENSOR FORM DATA
  useEffect(() => {
    if (selectedSensor) {
      setUpdateFormData({
        id: selectedSensor.id,
        name: selectedSensor.name || "",
        deviceTypeId: selectedSensor.deviceTypeId || null,
        topicStat: selectedSensor.topicStat || "",
        topicRec: selectedSensor.topicRec || "",
        topicRes: selectedSensor.topicRes || "",
        description: selectedSensor.description || "",
        boxId: selectedSensor.boxId || null,
        pin: selectedSensor.pin || "",
        active: selectedSensor.active || 0,
      });
    }
  }, [selectedSensor]);

  // UPDATE SENSOR FETCH
  const handleUpdateSensor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/api/Sensor/update`,
        updateFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sensor updated successfully");
        setIsDataChanged(true); // Set flag to true to trigger data refetch
        closeUpdateModal();
      } else {
        throw new Error("Failed to update sensor");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
    }
  };

  // UPDATE MODAL OPEN
  const openUpdateModal = (sensor) => {
    setSelectedSensor(sensor);
    const modal = document.getElementById("edit_sensor_modal");
    if (modal) modal.showModal();
  };

  // UPDATE MODAL CLOSE
  const closeUpdateModal = () => {
    const modal = document.getElementById("edit_sensor_modal");
    if (modal) modal.close();
    setSelectedSensor(null);
  };

  // UPDATE HANDLE INPUT CHANGE
  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // DELETE FORM DATA
  const [deleteFormData, setDeleteFormData] = useState({
    id: null,
    name: "",
    deviceTypeId: null,
    topicStat: "",
    topicRec: "",
    topicRes: "",
    description: "",
    boxId: null,
    pin: "",
    active: 0,
  });

  // DELETE SENSOR FETCH
  const handleDeleteSensor = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/api/Sensor/delete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: deleteFormData,
        }
      );

      if (response.status === 200) {
        toast.success("Sensor deleted successfully");
        setIsDataChanged(true); // Set flag to true to trigger data refetch
        document.getElementById("delete_sensor_modal").close();
      } else {
        throw new Error("Failed to delete sensor");
      }
    } catch (error) {
      toast.error("Error deleting sensor");
    } finally {
      setIsDeleting(false);
    }
  };

  // DELETE SENSOR FORM DATA
  useEffect(() => {
    if (selectedSensor) {
      setDeleteFormData({
        id: selectedSensor.id,
        name: selectedSensor.name,
        deviceTypeId: selectedSensor.deviceTypeId,
        topicStat: selectedSensor.topicStat,
        topicRec: selectedSensor.topicRec,
        topicRes: selectedSensor.topicRes,
        description: selectedSensor.description,
        boxId: selectedSensor.boxId,
        pin: selectedSensor.pin,
        active: selectedSensor.active,
      });
    }
  }, [selectedSensor]);

  // DELETE MODAL OPEN
  const openDeleteModal = (sensor) => {
    setSelectedSensor(sensor);
    const modal = document.getElementById("delete_sensor_modal");
    if (modal) modal.showModal();
  };

  // Search Bar Controller
  useEffect(() => {
    setFilteredSensors(
      sensors.filter((sensor) => {
        const searchTermLower = searchTerm.toLowerCase();

        return (
          sensor.name.toLowerCase().includes(searchTermLower) ||
          sensor.topicStat.toLowerCase().includes(searchTermLower) ||
          sensor.description.toLowerCase().includes(searchTermLower) ||
          getDeviceTypeName(sensor.deviceTypeId)
            .toLowerCase()
            .includes(searchTermLower) ||
          sensor.topicStat.toLowerCase().includes(searchTermLower) ||
          getBoxName(sensor.boxId).toLowerCase().includes(searchTermLower) ||
          sensor.pin.toLowerCase().includes(searchTermLower) ||
          (sensor.active ? "active" : "inactive").includes(searchTermLower)
        );
      })
    );
  }, [searchTerm, sensors]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-9"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-square p-2 rounded-lg mb-3"
          onClick={openAddModal}
        >
          <Activity />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search sensors..."
            className="bg-gray-700 text-white w-36 sm:w-48 md:w-48 lg:w-48 xl:w-48 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-y-auto h-table">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Device Type ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Topic Stat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Box
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Pin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Value Range ID
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
            {filteredSensors.length > 0 ? (
              filteredSensors.map((sensor) => (
                <motion.tr
                  key={sensor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {sensor.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {getDeviceTypeName(sensor.deviceTypeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {sensor.topicStat || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {sensor.description || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {getBoxName(sensor.boxId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {sensor.pin || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {sensor.unit || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {sensor.valueRangeId || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => openUpdateModal(sensor)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn text-red-400 hover:text-red-300"
                      onClick={() => openDeleteModal(sensor)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-4 text-center text-gray-400"
                >
                  No sensors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD SENSOR MODAL */}
      <dialog id="add_sensor_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Sensor</h3>
          <form onSubmit={handleAddSensor} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={addFormData.name || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="deviceTypeId"
                className="block text-sm font-medium text-gray-300"
              >
                Device Type
              </label>
              <select
                id="deviceTypeId"
                name="deviceTypeId"
                value={addFormData.deviceTypeId || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="topicStat"
                className="block text-sm font-medium text-gray-300"
              >
                Topic Stat
              </label>
              <input
                type="text"
                id="topicStat"
                name="topicStat"
                value={addFormData.topicStat || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="topicRec"
                className="block text-sm font-medium text-gray-300"
              >
                Topic Rec
              </label>
              <input
                type="text"
                id="topicRec"
                name="topicRec"
                value={addFormData.topicRec || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="topicRes"
                className="block text-sm font-medium text-gray-300"
              >
                Topic Res
              </label>
              <input
                type="text"
                id="topicRes"
                name="topicRes"
                value={addFormData.topicRes || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={addFormData.description || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="boxId"
                className="block text-sm font-medium text-gray-300"
              >
                Box Name
              </label>
              <select
                id="boxId"
                name="boxId"
                value={addFormData.boxId || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="">Select a Box</option>
                {boxes.map((box) => (
                  <option key={box.id} value={box.id}>
                    {box.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-gray-300"
              >
                Pin
              </label>
              <input
                type="text"
                id="pin"
                name="pin"
                value={addFormData.pin || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={addFormData.active || false}
                onChange={handleAddInputChange}
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm font-medium text-gray-300"
              >
                Active
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="btn btn-outline btn-success flex items-center gap-2"
              >
                <Save />
                Save
              </button>
              <button
                onClick={() =>
                  document.getElementById("add_sensor_modal").close()
                }
                className="btn btn-outline btn-error flex items-center gap-2"
              >
                <X />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeAddModal}>
            Close
          </button>
        </form>
      </dialog>

      {/* UPDATE SENSOR MODAL */}
      <dialog id="edit_sensor_modal" className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg mb-4">Edit Sensor</h3>
          {selectedSensor && (
            <>
              <form onSubmit={handleUpdateSensor} className="space-y-4">
                <div>
                  <label
                    htmlFor="nameUpdate"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="nameUpdate"
                    name="name"
                    value={updateFormData.name || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="deviceTypeId"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Device Type
                  </label>
                  <select
                    id="deviceTypeId"
                    name="deviceTypeId"
                    value={updateFormData.deviceTypeId || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="topicStat"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Topic Stat
                  </label>
                  <input
                    type="text"
                    id="topicStat"
                    name="topicStat"
                    value={updateFormData.topicStat || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="topicRec"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Topic Rec
                  </label>
                  <input
                    type="text"
                    id="topicRec"
                    name="topicRec"
                    value={updateFormData.topicRec || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="topicRes"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Topic Res
                  </label>
                  <input
                    type="text"
                    id="topicRes"
                    name="topicRes"
                    value={updateFormData.topicRes || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={updateFormData.description || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="boxId"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Box Name
                  </label>
                  <select
                    id="boxId"
                    name="boxId"
                    value={updateFormData.boxId || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  >
                    <option value="">Select a Box</option>
                    {boxes.map((box) => (
                      <option key={box.id} value={box.id}>
                        {box.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="pin"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Pin
                  </label>
                  <input
                    type="text"
                    id="pin"
                    name="pin"
                    value={updateFormData.pin || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={updateFormData.active === 1}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        active: e.target.checked ? 1 : 0,
                      })
                    }
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded"
                  />
                  <label
                    htmlFor="active"
                    className="ml-2 block text-sm font-medium text-gray-300"
                  >
                    Active
                  </label>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  {" "}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("edit_sensor_modal").close()
                    }
                    className="btn btn-outline btn-error flex items-center gap-2"
                  >
                    <X />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-outline btn-success flex items-center gap-2"
                  >
                    <Save />
                    Save
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeUpdateModal}>
            Close
          </button>
        </form>
      </dialog>

      {/* DELETE SENSOR MODAL */}
      <dialog id="delete_sensor_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this sensor?
          </h3>
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                document.getElementById("delete_sensor_modal").close()
              }
              className="btn btn-outline btn-accent px-4 py-2 flex items-center gap-2 mt-4 mr-3"
            >
              <X />
              <span className="hidden sm:inline">Close</span>
            </button>
            <button
              className="btn btn-outline btn-error mt-4"
              onClick={() => handleDeleteSensor()}
            >
              <Trash2 /> Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default SensorsTable;
