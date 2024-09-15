import React from "react";
import StatCardSkeleton from "../components/StatCardSkeleton";
import GraphCardSkeleton from "../components/GraphCardSkeleton";
import UsersTableSkeleton from "../components/UsersTableSkeleton";

const UserPageSkeleton = () => {
  return (
    <>
      {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div> */}
      <UsersTableSkeleton />
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GraphCardSkeleton />
        <GraphCardSkeleton />
      </div>{" "} */}
    </>
  );
};

export default UserPageSkeleton;
