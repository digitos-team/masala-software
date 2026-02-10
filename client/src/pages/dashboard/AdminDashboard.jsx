import React, { useState, useRef } from "react";
import AdminStats from "./components/AdminStats";
import DistributorTable from "./components/DistributorTable";
import RecentOrders from "./components/RecentOrders";
import AdminPendingActions from "./components/AdminPendingActions";
import AdminSalesChart from "./components/AdminSalesChart";
import { useNavigate } from "react-router-dom";
import CreateUserModal from "./components/CreateUserModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDistributors, setShowDistributors] = useState(false);
  const [modalRole, setModalRole] = useState(null); // 'distributor' or null
  const distributorListRef = useRef(null);

  const stats = [
    { title: "Today Sales", value: "₹12,500" },
    { title: "Monthly Sales", value: "₹2,45,000" },
    { title: "Total Orders", value: "184" },
    { title: "Active Distributors", value: "8" },
    { title: "Active Sub-Distributors", value: "24" },
  ];

  const distributorSales = [
    { name: "Distributor A", today: "₹5,200", month: "₹82,000", orders: 48 },
    { name: "Distributor B", today: "₹4,100", month: "₹71,500", orders: 39 },
    { name: "Distributor C", today: "₹3,200", month: "₹58,000", orders: 31 },
  ];

  const orders = [
    {
      id: "ORD101",
      distributor: "Distributor A",
      status: "Pending",
      amount: "₹1,200",
    },
  ];

  const handleCardClick = (title) => {
    if (title === "Active Distributors") {
      navigate("/manage-distributors");
    } else if (title === "Active Sub-Distributors") {
      navigate("/manage-sub-distributors");
    }
  };

  return (
    <div className="space-y-12">
      <AdminStats stats={stats} onCardClick={handleCardClick} />

      {/* ... rest of the file ... */}

      <section className="bg-white rounded-2xl border p-6">
        <AdminSalesChart />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AdminPendingActions />
        <RecentOrders orders={orders} />
      </section>

      {/* Logic for modals if any (optional) */}
    </div>
  );
};

export default AdminDashboard;
