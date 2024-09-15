import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Hotel, Save, Search, Trash2, X } from "lucide-react";
import cityMap from "../../lib/utils/data/CityMap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cityDistrictsMap from "../../lib/utils/data/CityDistrictsMap";
import { toast } from "react-toastify";

const OrganizationsTable = ({
  organizations,
  isDataChanged,
  setIsDataChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrganizations, setFilteredOrganizations] =
    useState(organizations);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);

  const handleAddCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    setDistricts(cityDistrictsMap[cityId]?.districts || []);
    setAddFormData((prevData) => ({
      ...prevData,
      cityId,
      districtId: "", // Reset district when city changes
    }));
  };

  const handleUpdateCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    setDistricts(cityDistrictsMap[cityId]?.districts || []);
    setUpdateFormData((prevData) => ({
      ...prevData,
      cityId,
      districtId: "", // Reset district when city changes
    }));
  };

  const handleAddDistrictChange = (event) => {
    setAddFormData({
      ...addFormData,
      districtId: event.target.value,
    });
  };

  const handleUpdateDistrictChange = (event) => {
    setUpdateFormData({
      ...updateFormData,
      districtId: event.target.value,
    });
  };

  const [addFormData, setAddFormData] = useState({
    name: "",
    address: "",
    cityId: 0,
    districtId: 0,
    type: 0,
    maxUserCount: 0,
    maxSessionCount: 0,
  });

  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: "",
    address: "",
    cityId: 0,
    districtId: 0,
    type: 0,
    maxUserCount: 0,
    maxSessionCount: 0,
  });

  const [deleteFormData, setDeleteFormData] = useState({
    id: null,
    name: "",
    address: "",
    cityId: 0,
    districtId: 0,
    type: 0,
    maxUserCount: 0,
    maxSessionCount: 0,
  });

  const navigate = useNavigate();

  // GET CITY NAME FROM ID
  const getCityName = (cityId) => {
    return cityMap[cityId] || "Unknown";
  };

  const getDistrictName = (cityId, districtId) => {
    const city = cityDistrictsMap[cityId];
    if (city) {
      // Compare ids as numbers if city.districts contains numeric ids
      const district = city.districts.find((d) => d.id === Number(districtId));
      return district ? district.name : "Unknown";
    }
    return "Unknown";
  };

  // ADD ORGANIZATION FETCH
  const handleAddOrganization = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      setError("No JWT token found.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/Organisation/add`,
        addFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Organization created successfully");
        closeAddModal();
        setIsDataChanged(true); // Notify that data has changed
      } else {
        toast.error("Failed to create organization");
        setError("Failed to create organization");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.title ||
        "An error occurred while creating the organization.";
      toast.error(errorMessage);
      console.error("Error response:", error.response);
    }
  };

  useEffect(() => {
    console.log("isDataChanged:", isDataChanged);
  }, [isDataChanged]);

  // ADD MODAL OPEN
  const openAddModal = () => {
    setAddFormData({
      name: "",
      address: "",
      cityId: 0,
      districtId: 0,
      type: 0,
      maxUserCount: 0,
      maxSessionCount: 0,
    });
    const modal = document.getElementById("add_organization_modal");
    if (modal) modal.showModal();
  };

  // ADD MODAL CLOSE
  const closeAddModal = () => {
    const modal = document.getElementById("add_organization_modal");
    if (modal) modal.close();
    setSelectedOrganization(null);
  };

  // ADD HANDLE INPUT CHANGE
  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // UPDATE ORGANIZATION FORM DATA
  useEffect(() => {
    if (selectedOrganization) {
      const cityId = selectedOrganization.cityId;
      setUpdateFormData({
        id: selectedOrganization.id,
        name: selectedOrganization.name || "",
        address: selectedOrganization.address || "",
        cityId: cityId || 0,
        districtId: selectedOrganization.districtId || 0,
        type: selectedOrganization.type || 0,
        maxUserCount: selectedOrganization.maxUserCount || 0,
        maxSessionCount: selectedOrganization.maxSessionCount || 0,
      });
      setDistricts(cityDistrictsMap[cityId]?.districts || []);
    }
  }, [selectedOrganization, cityDistrictsMap]);

  // UPDATE ORGANIZATION FETCH
  const handleUpdateOrganization = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      setError("No JWT token found.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/api/Organisation/update`,
        updateFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Organization updated successfully");
        setIsDataChanged(true); // Notify that data has changed
        closeUpdateModal();
      } else {
        throw new Error("Failed to update organization");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the organization.";
      toast.error(errorMessage);
      console.error("Error updating organization:", errorMessage);
    }
  };

  // UPDATE MODAL OPEN
  const openUpdateModal = (organization) => {
    setSelectedOrganization(organization);
    const modal = document.getElementById("edit_organization_modal");
    if (modal) {
      modal.showModal();
    }
  };

  // UPDATE MODAL CLOSE
  const closeUpdateModal = () => {
    const modal = document.getElementById("edit_organization_modal");
    if (modal) modal.close();
    setSelectedOrganization(null);
  };

  // UPDATE HANDLE INPUT CHANGE
  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // DELETE ORGANIZATION FETCH
  const handleDeleteOrganization = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found.");
      setError("No JWT token found.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/api/Organisation/delete`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: deleteFormData,
        }
      );

      if (response.status === 200) {
        toast.success("Organization deleted successfully");
        setIsDataChanged(true); // Notify that data has changed
        document.getElementById("delete_organization_modal").close();
        setError(""); // Clear error message
      } else {
        throw new Error("Failed to delete organization");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the organization.";
      toast.error(errorMessage); // Show error message
      console.error("Error deleting organization:", errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // DELETE ORGANIZATION FORM DATA
  useEffect(() => {
    if (selectedOrganization) {
      setDeleteFormData({
        id: selectedOrganization.id,
        name: selectedOrganization.name,
        address: selectedOrganization.address,
        cityId: selectedOrganization.cityId,
        districtId: selectedOrganization.districtId,
        type: selectedOrganization.type,
        maxUserCount: selectedOrganization.maxUserCount,
        maxSessionCount: selectedOrganization.maxSessionCount,
      });
    }
  }, [selectedOrganization]);

  // DELETE MODAL OPEN
  const openDeleteModal = (organization) => {
    setSelectedOrganization(organization);
    const modal = document.getElementById("delete_organization_modal");
    if (modal) modal.showModal();
  };

  // SEARCH ORGANIZATIONS
  useEffect(() => {
    setFilteredOrganizations(
      organizations.filter((organization) => {
        const term = searchTerm.toLowerCase();
        return (
          organization.name.toLowerCase().includes(term) ||
          organization.address.toLowerCase().includes(term) ||
          getCityName(organization.cityId).toLowerCase().includes(term) ||
          organization.districtId.toString().includes(term) ||
          organization.type.toString().includes(term)
        );
      })
    );
  }, [searchTerm, organizations]);

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
        <button className="btn btn-square rounded-lg" onClick={openAddModal}>
          <Hotel />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search organizations..."
            className="bg-gray-700 text-white w-36 sm:w-48 md:w-48 lg:w-48 xl:w-48 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto h-table">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                District ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Max Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Max Sessions
                </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredOrganizations.map((organization) => (
              <motion.tr
                key={organization.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {organization.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {organization.address.length > 20
                    ? `${organization.address.slice(0, 36)}...`
                    : organization.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {getCityName(organization.cityId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {getDistrictName(
                    organization.cityId,
                    organization.districtId
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {organization.type === 1
                    ? "Kurumsal"
                    : organization.type === 2
                      ? "Bireysel"
                      : ""}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                    {organization.maxUserCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                    {organization.maxSessionCount}
                  </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => openUpdateModal(organization)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => openDeleteModal(organization)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="add_organization_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Organization</h3>
          <form onSubmit={handleAddOrganization} className="space-y-4">
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
                value={addFormData.name}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={addFormData.address}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-300"
              >
                City:
              </label>
              <select
                id="cityIdAdd"
                name="cityId"
                value={addFormData.cityId || ""}
                onChange={handleAddCityChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="">Select City</option>
                {Object.entries(cityDistrictsMap).map(([id, city]) => (
                  <option key={id} value={id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-300"
              >
                District:
              </label>
              <select
                id="districtIdAdd"
                name="districtId"
                value={addFormData.districtId || ""}
                onChange={handleAddDistrictChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-300"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                value={addFormData.type}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              >
                <option value={1}>Kurumsal</option>
                <option value={2}>Bireysel</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="maxUserCount"
                className="block text-sm font-medium text-gray-300"
              >
                Max Users
              </label>
              <input
                type="number"
                id="maxUserCount"
                name="maxUserCount"
                value={addFormData.maxUserCount}
                onChange={handleAddInputChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="maxSessionCount"
                className="block text-sm font-medium text-gray-300"
              >
                Max Sessions
              </label>
              <input
                type="number"
                id="maxSessionCount"
                name="maxSessionCount"
                value={addFormData.maxSessionCount}
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
              {" "}
              <button
                type="button"
                onClick={closeAddModal}
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
      {/* UPDATE ORGANIZATION MODAL */}
      <dialog id="edit_organization_modal" className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg mb-4">Edit Organization</h3>
          {selectedOrganization && (
            <form onSubmit={handleUpdateOrganization} className="space-y-4">
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
                  htmlFor="addressUpdate"
                  className="block text-sm font-medium text-gray-300"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="addressUpdate"
                  name="address"
                  value={updateFormData.address || ""}
                  onChange={handleUpdateInputChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="cityIdUpdate"
                  className="block text-sm font-medium text-gray-300"
                >
                  City
                </label>
                <select
                  id="cityIdUpdate"
                  name="cityId"
                  value={updateFormData.cityId || ""}
                  onChange={handleUpdateCityChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                  <option value="">Select City</option>
                  {Object.entries(cityDistrictsMap).map(([id, city]) => (
                    <option key={id} value={id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="districtIdUpdate"
                  className="block text-sm font-medium text-gray-300"
                >
                  District
                </label>
                <select
                  id="districtIdUpdate"
                  name="districtId"
                  value={updateFormData.districtId || ""}
                  onChange={handleUpdateDistrictChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-300"
                >
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={updateFormData.type}
                  onChange={handleUpdateInputChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                >
                  <option value={1}>Kurumsal</option>
                  <option value={2}>Bireysel</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="maxUserCountUpdate"
                  className="block text-sm font-medium text-gray-300"
                >
                  Max Users
                </label>
                <input
                  type="number"
                  id="maxUserCountUpdate"
                  name="maxUserCount"
                  value={updateFormData.maxUserCount || ""}
                  onChange={handleUpdateInputChange}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="maxSessionCountUpdate"
                  className="block text-sm font-medium text-gray-300"
                >
                  Max Sessions
                </label>
                <input
                  type="number"
                  id="maxSessionCountUpdate"
                  name="maxSessionCount"
                  value={updateFormData.maxSessionCount || ""}
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
                {" "}
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("edit_organization_modal").close()
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
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeUpdateModal}>
            Close
          </button>
        </form>
      </dialog>
      {/* DELETE ORGANIZATION MODAL */}
      <dialog id="delete_organization_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this organization?
          </h3>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => document.getElementById("delete_organization_modal").close()}
              className="btn btn-outline btn-accent px-4 py-2 flex items-center gap-2 mt-4 mr-3"
            >
              <X />
              <span className="hidden sm:inline">Close</span>
            </button>
            <button
              className="btn btn-outline btn-error mt-4"
              onClick={() => handleDeleteOrganization()}
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
export default OrganizationsTable;
