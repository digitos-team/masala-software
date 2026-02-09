import { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= CONSTANTS ================= */

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Approved: "#6366f1",
  Dispatched: "#8b5cf6",
  Delivered: "#10b981",
};

const Reports = () => {
  /* ================= STATE ================= */
  const [filter, setFilter] = useState("month");

  /* ================= DATA (API READY) ================= */

  const stats = [
    { label: "Today Sales", value: "₹12,500" },
    { label: "Monthly Sales", value: "₹2,45,000" },
    { label: "Total Orders", value: "184" },
    { label: "Active Distributors", value: "18" },
  ];

  const monthlySales = [
    { month: "Jan", sales: 120000 },
    { month: "Feb", sales: 145000 },
    { month: "Mar", sales: 98000 },
    { month: "Apr", sales: 165000 },
    { month: "May", sales: 210000 },
  ];

  const orderStatus = [
    { name: "Pending", value: 12 },
    { name: "Approved", value: 30 },
    { name: "Dispatched", value: 18 },
    { name: "Delivered", value: 124 },
  ];

  const distributorSales = [
    { name: "Distributor A", orders: 45, sales: "₹1,25,000" },
    { name: "Distributor B", orders: 32, sales: "₹92,000" },
    { name: "Distributor C", orders: 21, sales: "₹68,500" },
  ];

  /* ================= UI ================= */

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Sales Reports</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            filter === "today"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilter("month")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            filter === "month"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          This Month
        </button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white p-5 rounded-2xl border shadow-sm"
          >
            <p className="text-sm text-slate-500 mb-1">{item.label}</p>
            <h2 className="text-xl font-bold text-slate-900">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* 🔥 CHARTS SECTION (SIDE BY SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* MONTHLY SALES */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySales}>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDER STATUS PIE */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          <div className="h-[260px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={orderStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {orderStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DISTRIBUTOR SALES */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Distributor-wise Sales</h3>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-slate-500">
                Distributor
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500">
                Orders
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500">
                Sales
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {distributorSales.map((d) => (
              <tr key={d.name} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium">{d.name}</td>
                <td className="px-5 py-3">{d.orders}</td>
                <td className="px-5 py-3 font-bold">{d.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Showing data for <b>{filter === "today" ? "Today" : "This Month"}</b>
      </p>
    </div>
  );
};

export default Reports;
