import React from "react";
import { motion } from "framer-motion";

const SalesChannelChartSkeleton = () => {
  return (
    <motion.div
      className="bg-purple-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>
      <div className="h-80 flex items-center justify-center">
        <div className="h-48 w-full bg-gray-700 rounded"></div>
      </div>
    </motion.div>
  );
};

export default SalesChannelChartSkeleton;
