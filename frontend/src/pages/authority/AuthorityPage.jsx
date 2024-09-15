import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, FileText, Briefcase } from "lucide-react";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import SalesOverviewChart from "../../components/overview/SalesOverviewChart"; // Reusing existing charts
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart"; // Reusing existing charts
import SalesChannelChart from "../../components/overview/SalesChannelChart"; // Reusing existing charts
import OverviewPageSkeleton from "../../lib/utils/skeletons/pages/OverviewPageSkeleton";

const AuthorityPage = () => {
  const [loading, setLoading] = useState(false); // Yayınlamadan değiştirmeyi unutma
  const [error, setError] = useState(null);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Authority" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading && <OverviewPageSkeleton />} {/* Yüklenme durumu */}
        {error && <p className="text-red-500">Error: {error}</p>}{" "}
        {/* Hata durumu */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Authorities"
            icon={Shield}
            value="15"
            color="#34D399" // Authority sayfası için önerilen renk
          />
          <StatCard
            name="Pending Approvals"
            icon={Briefcase}
            value="5"
            color="#10B981"
          />
          <StatCard
            name="Active Roles"
            icon={Users}
            value="8"
            color="#3B82F6"
          />
          <StatCard
            name="Documents Processed"
            icon={FileText}
            value="120"
            color="#F59E0B"
          />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default AuthorityPage;
