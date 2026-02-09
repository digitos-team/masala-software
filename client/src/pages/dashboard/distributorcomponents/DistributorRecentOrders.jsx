import React from "react";
import DistributorStats from "./distributorcomponents/DistributorStats";
import SubDistributorTable from "./distributorcomponents/SubDistributorTable";
import DistributorRecentOrders from "./distributorcomponents/DistributorRecentOrders";

const DistributorDashboard = () => {
  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Distributor Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of your sales and sub-distributor performance.
        </p>
      </header>

      {/* TOP STATS */}
      <DistributorStats />

      {/* SUB-DISTRIBUTOR SALES */}
      <SubDistributorTable />

      {/* RECENT ORDERS */}
      <DistributorRecentOrders />
    </div>
  );
};

export default DistributorDashboard;
