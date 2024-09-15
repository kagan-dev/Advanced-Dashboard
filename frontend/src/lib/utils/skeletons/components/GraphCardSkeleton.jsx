import { motion } from "framer-motion";

const GraphCardSkeleton = () => {
  return (
    <motion.div
      className="skeleton bg-purple-950 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Skeleton for the title */}
      <div className="h-6 w-48 mb-4 bg-gray-700 rounded"></div>

      {/* Skeleton for the chart area */}
      <div className="h-80 w-full bg-gray-700 rounded"></div>
    </motion.div>
  );
};

export default GraphCardSkeleton;
