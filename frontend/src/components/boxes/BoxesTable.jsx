"use client";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Edit,
  MonitorSmartphone,
  Package,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cityMap from "../../lib/utils/data/CityMap";
import { toast } from "react-toastify";

const BoxesTable = ({
  boxes = [],
  organizations = [],
  isDataChanged,
  setIsDataChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBoxes, setFilteredBoxes] = useState(boxes);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("isDataChanged:", isDataChanged);
  }, [isDataChanged]);

  // ADD BOX FORM DATA
  const [addFormData, setAddFormData] = useState({
    name: "",
    chipId: "",
    organisationId: null,
    active: 0,
    topicRec: "",
    topicRes: "",
    version: null,
  });

  const cityDistribution = organizations.reduce((acc, org) => {
    const cityName = cityMap[org.cityId] || "Unknown";
    acc[cityName] = (acc[cityName] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(cityDistribution).map((cityName) => ({
    name: cityName,
    value: cityDistribution[cityName],
  }));

  // ADD BOX FETCH
  const handleAddBox = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      setError("No JWT token found.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/Box/add`,
        addFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Box created successfully");
        setIsDataChanged(true);
        closeAddModal(); 
      } else {
        toast.error("Failed to create box");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.title || "Validation error occurred.");
        console.error("Validation errors:", error.response.data.errors);
      } else if (error.request) {
        toast.error("No response received from the server.");
      } else {
        toast.error("An error occurred while creating the box.");
        console.error("Error message:", error.message);
      }
    }
  };

  // ADD MODAL OPEN
  const openAddModal = () => {
    setAddFormData({
      name: "",
      chipId: "",
      organisationId: "",
      active: 0,
      topicRec: "",
      topicRes: "",
      version: "",
    });
    const modal = document.getElementById("add_box_modal");
    if (modal) modal.showModal();
  };

  // ADD MODAL CLOSE
  const closeAddModal = () => {
    const modal = document.getElementById("add_box_modal");
    if (modal) modal.close();
    setSelectedBox(null);
  };

  // ADD HANDLE INPUT CHANGE
  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // UPDATE BOX DATA
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: "",
    chipId: null,
    organisationId: null,
    active: 0,
    topicRec: "",
    topicRes: "",
    version: "",
  });

  // UPDATE BOX FORM DATA
  useEffect(() => {
    if (selectedBox) {
      setUpdateFormData({
        id: selectedBox.id,
        name: selectedBox.name || "",
        chipId: selectedBox.chipId || null,
        organisationId: selectedBox.organisationId || null,
        active: selectedBox.active || 0,
        topicRec: selectedBox.topicRec || "",
        topicRes: selectedBox.topicRes || "",
        version: selectedBox.version || "",
      });
    }
  }, [selectedBox]);

  // UPDATE BOX FETCH
  const handleUpdateBox = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      setError("No JWT token found.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/api/Box/update`,
        updateFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Box updated successfully");
        setIsDataChanged(true); // Set flag to true to trigger data refetch
        closeUpdateModal();
      } else {
        throw new Error("Failed to update box");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
      console.error(
        "Error updating box:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // UPDATE MODAL OPEN
  const openUpdateModal = (box) => {
    setSelectedBox(box);
    const modal = document.getElementById("edit_box_modal");
    if (modal) modal.showModal();
  };

  // UPDATE MODAL CLOSE
  const closeUpdateModal = () => {
    const modal = document.getElementById("edit_box_modal");
    if (modal) modal.close();
    setSelectedBox(null);
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
    chipId: null,
    organisationId: null,
    active: 0,
    topicRec: "",
    topicRes: "",
    version: "",
  });

  // DELETE BOX FETCH
  const handleDeleteBox = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      setError("No JWT token found.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/api/Box/delete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: deleteFormData,
        }
      );

      if (response.status === 200) {
        toast.success("Box deleted successfully");
        setIsDataChanged(true); // Set flag to true to trigger data refetch
        document.getElementById("delete_box_modal").close();
      } else {
        throw new Error("Failed to delete box");
      }
    } catch (error) {
      toast.error("Error deleting box");
      console.error("Error deleting box:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // DELETE BOX FORM DATA
  useEffect(() => {
    if (selectedBox) {
      setDeleteFormData({
        id: selectedBox.id,
        name: selectedBox.name,
        chipId: selectedBox.chipId,
        organisationId: selectedBox.organisationId,
        active: selectedBox.active,
        topicRec: selectedBox.topicRec,
        topicRes: selectedBox.topicRes,
        version: selectedBox.version,
      });
    }
  }, [selectedBox]);

  // DELETE MODAL OPEN
  const openDeleteModal = (box) => {
    setSelectedBox(box);
    const modal = document.getElementById("delete_box_modal");
    if (modal) modal.showModal();
  };

  // Search Bar Controller
  useEffect(() => {
    setFilteredBoxes(
      boxes.filter((box) => {
        const searchTermLower = searchTerm.toLowerCase();

        // Find the associated organization
        const organization = organizations.find(
          (org) => org.id === box.organisationId
        );

        // Search conditions
        return (
          box.name.toLowerCase().includes(searchTermLower) ||
          box.topicRec.toLowerCase().includes(searchTermLower) ||
          box.topicRes.toLowerCase().includes(searchTermLower) ||
          (organization &&
            organization.name.toLowerCase().includes(searchTermLower)) ||
          (box.active ? "active" : "inactive").includes(searchTermLower)
        );
      })
    );
  }, [searchTerm, boxes, organizations]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-square p-2 rounded-lg mb-3"
          onClick={openAddModal}
        >
          <Package />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white w-36 sm:w-48 md:w-48 lg:w-48 xl:w-48 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Chip Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rec
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                RES
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
            {filteredBoxes.map((box) => {
              // organizationId ile ilgili organizasyonu bul
              const organization = organizations.find(
                (org) => org.id === box.organisationId
              );

              return (
                <motion.tr
                  key={box.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <MonitorSmartphone className="size-10" color="#6366F1" />
                    {box.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {organization ? organization.name : "Unknown Organization"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {box.chipId}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {box.topicRec}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {box.topicRes}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        box.active
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {box.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => openUpdateModal(box)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => openDeleteModal(box)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD BOX MODAL */}
      <dialog id="add_box_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Box</h3>
          <form onSubmit={handleAddBox} className="space-y-4">
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
                htmlFor="chipId"
                className="block text-sm font-medium text-gray-300"
              >
                Chip ID
              </label>
              <input
                type="number"
                id="chipId"
                name="chipId"
                value={addFormData.chipId || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="organisationId"
                className="block text-sm font-medium text-gray-300"
              >
                Organization
              </label>
              <select
                id="organisationId"
                name="organisationId"
                value={addFormData.organisationId || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="">Select an Organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
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
                htmlFor="version"
                className="block text-sm font-medium text-gray-300"
              >
                Version
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={addFormData.version || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={addFormData.active === 1}
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
                type="button"
                onClick={() => document.getElementById("add_box_modal").close()}
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
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeAddModal}>
            Close
          </button>
        </form>
      </dialog>

      {/* UPDATE BOX MODAL */}
      <dialog id="edit_box_modal" className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg mb-4">Edit Box</h3>
          {selectedBox && (
            <>
              <form onSubmit={handleUpdateBox} className="space-y-4">
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
                    htmlFor="chipIdUpdate"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Chip ID
                  </label>
                  <input
                    type="number"
                    id="chipIdUpdate"
                    name="chipId"
                    value={updateFormData.chipId || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="organisationId"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Organization
                  </label>
                  <select
                    id="organisationId"
                    name="organisationId"
                    value={updateFormData.organisationId || ""}
                    onChange={handleUpdateInputChange}
                    className="bg-gray-900 mt-1 block w-full rounded-md border-gray-700  text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  >
                    <option value="">Select an Organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="topicRecUpdate"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Topic Rec
                  </label>
                  <input
                    type="text"
                    id="topicRecUpdate"
                    name="topicRec"
                    value={updateFormData.topicRec || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="topicResUpdate"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Topic Res
                  </label>
                  <input
                    type="text"
                    id="topicResUpdate"
                    name="topicRes"
                    value={updateFormData.topicRes || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="versionUpdate"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Version
                  </label>
                  <input
                    type="text"
                    id="versionUpdate"
                    name="version"
                    value={updateFormData.version || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activeUpdate"
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
                    htmlFor="activeUpdate"
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
                      document.getElementById("edit_box_modal").close()
                    }
                    className="btn btn-outline btn-error flex items-center gap-2"
                  >
                    <X />
                    <span className="hidden sm:inline">Close</span>
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

      {/* DELETE BOX MODAL */}
      <dialog id="delete_box_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this box?
          </h3>
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                document.getElementById("delete_box_modal").close()
              }
              className="btn btn-outline btn-accent px-4 py-2 flex items-center gap-2 mt-4 mr-3"
            >
              <X />
              <span className="hidden sm:inline">Close</span>
            </button>
            <button
              className="btn btn-outline btn-error mt-4"
              onClick={() => handleDeleteBox()}
            >
              <Trash2 /> Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </motion.div>
  );
};
export default BoxesTable;
