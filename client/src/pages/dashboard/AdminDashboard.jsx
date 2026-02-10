import React, { useState, useEffect, useMemo, useRef } from "react";
import AdminStats from "./components/AdminStats";
import RecentOrders from "./components/RecentOrders";
import AdminPendingActions from "./components/AdminPendingActions";
import AdminSalesChart from "./components/AdminSalesChart";
import { useNavigate } from "react-router-dom";
import { getAllOrders, getOrderStats } from "../../api/admin/order.api";
import { getPaymentStats, getPaymentHistory } from "../../api/admin/payment.api";
import { getProductStats } from "../../api/admin/product.api";
import { getDistributors, getSubDistributors } from "../../api/auth/auth.api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [subDistributors, setSubDistributors] = useState([]);
  const [collectionStats, setCollectionStats] = useState({ today: 0, month: 0 });
  const [payments, setPayments] = useState([]);
  const [statsData, setStatsData] = useState({ orders: null, products: null });
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().toISOString().slice(0, 7);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const [ordersData, distributorsData, subDistributorsData, todayCollection, monthCollection, historyRes, orderStatsRes, productStatsRes] = await Promise.all([
          getAllOrders({ limit: 1000 }),
          getDistributors(),
          getSubDistributors(),
          getPaymentStats({ startDate: today }),
          getPaymentStats({ startDate: `${currentMonth}-01` }),
          getPaymentHistory({ startDate: sixMonthsAgo.toISOString().split('T')[0], limit: 1000 }),
          getOrderStats(),
          getProductStats()
        ]);

        const paymentsArray = Array.isArray(historyRes?.data)
          ? historyRes.data
          : (historyRes?.data?.payments || []);

        console.log("Admin Dashboard Debug:", {
          ordersCount: ordersData?.data?.orders?.length || ordersData?.data?.length,
          distributorsCount: distributorsData?.data?.length,
          subDistributorsCount: subDistributorsData?.data?.length,
          todayRevenue: todayCollection?.data?.totalRevenue,
          monthRevenue: monthCollection?.data?.totalRevenue,
          paymentsCount: paymentsArray.length,
          orderStats: orderStatsRes?.data,
          productStats: productStatsRes?.data
        });

        setOrders(ordersData?.data?.orders || ordersData?.data || []);
        setDistributors(distributorsData?.data || []);
        setSubDistributors(subDistributorsData?.data || []);
        setPayments(paymentsArray);
        setCollectionStats({
          today: todayCollection?.data?.totalRevenue || 0,
          month: monthCollection?.data?.totalRevenue || 0
        });

        setStatsData({
          orders: orderStatsRes?.data,
          products: productStatsRes?.data
        });

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Stats
  const stats = useMemo(() => {
    // Calculate Today's Sales 
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt?.startsWith(today) && o.status !== "cancelled");
    const todaySalesVal = todayOrders.reduce((acc, curr) => acc + (curr.pricing?.grandTotal || 0), 0);

    // Monthly Sales
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthOrders = orders.filter(o => o.createdAt?.startsWith(currentMonth) && o.status !== "cancelled");
    const monthSalesVal = monthOrders.reduce((acc, curr) => acc + (curr.pricing?.grandTotal || 0), 0);

    // Total Orders (excluding cancelled)
    const totalOrders = orders.filter(o => o.status !== "cancelled").length;

    return [
      { title: "Today Sales", value: `₹${todaySalesVal.toLocaleString()}` },
      { title: "Monthly Sales", value: `₹${monthSalesVal.toLocaleString()}` },
      { title: "Total Orders", value: totalOrders.toString() },
      { title: "Active Distributors", value: distributors.length.toString(), isClickable: true },
      { title: "Active Sub-Distributors", value: subDistributors.length.toString(), isClickable: true },
    ];
  }, [orders, distributors, subDistributors, collectionStats]);

  const handleCardClick = (title) => {
    if (title === "Active Distributors") {
      navigate("/manage-distributors");
    } else if (title === "Active Sub-Distributors") {
      navigate("/manage-sub-distributors");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <AdminStats stats={stats} onCardClick={handleCardClick} />

      <section className="bg-white rounded-2xl border p-6">
        <AdminSalesChart orders={orders} payments={payments} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AdminPendingActions
          orderStats={statsData.orders}
          productStats={statsData.products}
        />
        <RecentOrders orders={orders.slice(0, 5)} />
      </section>
    </div>
  );
};

export default AdminDashboard;
