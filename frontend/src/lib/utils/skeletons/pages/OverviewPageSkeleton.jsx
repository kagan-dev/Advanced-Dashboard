import React from "react";
import StatCardSkeleton from "../components/StatCardSkeleton";
import GraphCardSkeleton from "../components/GraphCardSkeleton";
import DoubleGraphSkeleton from "../components/DoubleGraphSkeleton";

const OverviewPageSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GraphCardSkeleton />
        <GraphCardSkeleton />
        <DoubleGraphSkeleton />
      </div>{" "}
    </>
  );
};

export default OverviewPageSkeleton;
