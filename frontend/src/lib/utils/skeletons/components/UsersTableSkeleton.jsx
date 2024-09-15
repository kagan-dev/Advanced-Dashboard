import React from "react";
import { motion } from "framer-motion";

const UsersTableSkeleton = () => {
  return (
    <motion.div
      className="bg-purple-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-9"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Skeleton for header (title and search input) */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-24 bg-gray-700 rounded"></div>
        <div className="relative w-64">
          <div className="h-10 bg-gray-700 rounded-lg"></div>
          <div className="absolute left-3 top-2.5 h-4 w-4 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Skeleton for table */}
      <div className="overflow-x-auto h-table">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                    </div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-700 rounded w-10"></div>
                    <div className="h-4 bg-gray-700 rounded w-10"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTableSkeleton;
