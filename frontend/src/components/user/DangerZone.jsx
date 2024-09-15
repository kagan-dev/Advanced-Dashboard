import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DangerZone = ({ userData }) => {
  const user = userData.data;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.error("No JWT token found."); // Use toast for error
      setLoading(false);
      return;
    }

    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_SERVER_URI}/api/User/delete`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: user.id,
          userName: user.userName,
          fullName: user.fullName,
          mail: user.mail,
          telephone: user.telephone,
          active: user.active,
          passwordHash: user.passwordHash,
          passwordSalt: user.passwordSalt,
        },
      });

      if (response.status === 200) {
        toast.success("Account successfully deleted."); // Success notification

        // Wait 1 second before navigating
        setTimeout(() => {
          navigate("/users"); // Redirect to users page
        }, 1000);
      } else {
        toast.error("Failed to delete account."); // Error notification
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`); // Error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <Trash2 className="text-red-400 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-100">Danger Zone</h2>
      </div>
      <p className="text-gray-300 mb-4">
        Permanently delete your account and all of your content.
      </p>
      <button
        onClick={() => handleDelete()}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>
    </motion.div>
  );
};

export default DangerZone;
