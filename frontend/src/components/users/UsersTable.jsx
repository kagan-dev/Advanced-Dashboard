"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Hospital,
  Key,
  Save,
  Search,
  Trash2,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { IoPersonAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users = [], isDataChanged, setIsDataChanged }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isDataChanged:", isDataChanged);
  }, [isDataChanged]);

  // Add Form Data
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    userName: "",
    mail: "",
    telephone: "",
    active: 1,
    // password: "",
  });

  // Update Form Data
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    fullName: "",
    userName: "",
    mail: "",
    telephone: "",
    active: 0,
  });

  // Update Password Form Data
  const [updatePasswordFormData, setUpdatePasswordFormData] = useState({
    id: Number,
    password: "",
  });
  const [error, setError] = useState("");

  // Update Organization Form Data
  const [updateOrganizationFormData, setUpdateOrganizationFormData] = useState({
    id: 0,
    userId: 0,
    organisationId: 0,
  });

  // Delete Form Data
  const [deleteFormData, setDeleteFormData] = useState({
    id: Number,
    userName: "",
    fullName: "",
    mail: "",
    telephone: "",
    active: 0,
    passwordHash: "",
    passwordSalt: "",
  });

  // Search Bar Controller
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const fullNameMatch = user.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const userNameMatch = user.userName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const mailMatch = user.mail
          ? user.mail.toLowerCase().includes(searchTerm.toLowerCase())
          : false;

        return fullNameMatch || userNameMatch || mailMatch;
      })
    );
  }, [searchTerm, users]);

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("No JWT token found in localStorage.");
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/api/User/delete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: deleteFormData,
        }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully");
        document.getElementById("delete_modal").close();
        setIsDataChanged(true); // Trigger data refresh
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setUpdateFormData({
        id: selectedUser.id,
        fullName: selectedUser.fullName || "",
        userName: selectedUser.userName || "",
        mail: selectedUser.mail || "",
        telephone: selectedUser.telephone || "",
        active: selectedUser.active || 1,
      });
      setDeleteFormData({
        id: selectedUser.id,
        fullName: selectedUser.fullName,
        userName: selectedUser.userName,
        mail: selectedUser.mail,
        telephone: selectedUser.telephone,
        active: 0,
        passwordHash: selectedUser.passwordHash,
        passwordSalt: selectedUser.passwordSalt,
      });
      setUpdatePasswordFormData({
        id: selectedUser.id,
        password: selectedUser.password || "",
      });
      setUpdateOrganizationFormData({
        userId: selectedUser.id,
        organisationId: selectedUser.organisationId || 0,
        id: 0,
      });
    }
  }, [selectedUser]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    const modal = document.getElementById("edit_user_modal");
    if (modal) modal.showModal();
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    const modal = document.getElementById("delete_modal");
    if (modal) modal.showModal();
  };

  const closeEditModal = () => {
    const modal = document.getElementById("edit_user_modal");
    if (modal) modal.close();
    setSelectedUser(null);
  };

  const closeAddModal = () => {
    const modal = document.getElementById("add_user_modal");
    if (modal) modal.close();
    setSelectedUser(null);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdatePasswordChange = (e) => {
    const { value } = e.target;
    setUpdatePasswordFormData((prevData) => ({
      ...prevData,
      password: value,
    }));
  };

  const handleUpdateOrganizationChange = (e) => {
    const { value } = e.target;
    setUpdateOrganizationFormData((prevData) => ({
      ...prevData,
      organisationId: Number(value), // Convert to number if needed
    }));
  };

  useEffect(() => {
    // Fetch organizations from the API
    const fetchOrganizations = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.error("No JWT token found in localStorage.");
        setError("No JWT token found.");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Organisation/getall`,
          {
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
        setOrganizations(data.data);
      } catch (error) {
        console.error("Error fetching organizations:", error.message);
        setError("Failed to fetch organizations.");
      }
    };

    fetchOrganizations();
  }, []);

  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("No JWT token found in localStorage.");
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/api/Auth/setpassword?userId=${updatePasswordFormData.id}&newPassword=${updatePasswordFormData.password}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password updated successfully");
        closeEditModal();
        setIsDataChanged(true); // Trigger data refresh
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateOrganization = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/UserOrganisation/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateOrganizationFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      toast.success("Organization updated successfully!");
      closeEditModal();
      setIsDataChanged(true);
    } catch (error) {
      toast.error("Failed to update organization.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("No JWT token found in localStorage.");
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/api/User/update`,
        updateFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("User updated successfully");
        closeEditModal();
        setIsDataChanged(true); // Trigger data refresh
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("No JWT token found in localStorage.");
      toast.error("No JWT token found.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/User/add`,
        addFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("User created successfully");
        setIsDataChanged(true); // Trigger data refresh
        closeAddModal();
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
    }
  };

  const openAddModal = () => {
    setAddFormData({
      fullName: "",
      userName: "",
      mail: "",
      telephone: "",
      active: 1,
      password: "",
    });
    const modal = document.getElementById("add_user_modal");
    if (modal) modal.showModal();
  };

  return (
    <motion.div
      className="bg-purple-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        {" "}
        <button
          className="btn btn-square p-2 rounded-lg"
          onClick={openAddModal}
        >
          <IoPersonAddOutline />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white w-36 sm:w-48 md:w-48 lg:w-48 xl:w-48 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto h-table">
        <table className="min-w-full divide-y divide-gray-700 ">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.fullName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">
                          <button
                            onClick={() => navigate(`/users/${user.userName}`)}
                          >
                            {user.fullName}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {user.mail || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => openModal(user)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn text-red-400 hover:text-red-300"
                      onClick={() => openDeleteModal(user)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      <dialog id="edit_user_modal" className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg mb-4">Edit User</h3>
          {selectedUser && (
            <>
              {/* User Information Update Form */}
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label
                    htmlFor="fullNameUpdate"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={updateFormData.fullName || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={updateFormData.userName || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="mail"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="mail"
                    name="mail"
                    value={updateFormData.mail || ""}
                    onChange={handleUpdateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Telephone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={updateFormData.telephone || ""}
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
                      document.getElementById("edit_user_modal").close()
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

              {/* Password Update Form */}
              <form onSubmit={handleUpdatePassword} className="space-y-4 mt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={updatePasswordFormData.password || ""}
                      onChange={handleUpdatePasswordChange}
                      className="mt-1 block w-full h-10 rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 btn btn-outline btn-info flex items-center justify-center mt-5"
                  >
                    <Key />
                    Update Password
                  </button>
                </div>
              </form>

              {/* Organization Update Form */}
              <form
                onSubmit={handleUpdateOrganization}
                className="space-y-4 mt-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Organization
                    </label>
                    <select
                      id="organization"
                      name="organization"
                      value={updateOrganizationFormData.organisationId || ""}
                      onChange={handleUpdateOrganizationChange}
                      className="mt-1 block w-full h-10 rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-orange-500 focus:ring focus:ring-blue-500"
                    >
                      <option value="" disabled>
                      &nbsp;&nbsp;&nbsp;Select an organization
                      </option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="h-10 btn btn-outline btn-accent flex items-center justify-center mt-5"
                  >
                    <Hospital />
                    Organization
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => document.getElementById("edit_user_modal").close()}
          >
            Close
          </button>
        </form>
      </dialog>

      {/* Delete User Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this user?
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
              onClick={() => handleDeleteUser()}
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

      {/* Add User Modal */}
      <dialog id="add_user_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={addFormData.fullName || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={addFormData.userName || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="mail"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={addFormData.mail || ""}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-300"
              >
                Telephone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={addFormData.telephone || ""}
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
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
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
                onClick={() =>
                  document.getElementById("add_user_modal").close()
                }
                className="btn btn-outline btn-error px-4 py-2 flex items-center gap-2"
              >
                <X />
                <span className="hidden sm:inline">Close</span>
              </button>
              <button
                type="submit"
                className="btn btn-outline btn-info px-4 py-2 flex items-center gap-2"
              >
                <UserPlus /> Add User
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => document.getElementById("add_user_modal").close()}
          >
            Close
          </button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default UsersTable;
