import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllOrders } from "../../api/admin/order.api";
import { getProducts } from "../../api/admin/product.api";
import { useAuth } from "../../context/AuthContext";

/* ================= CONSTANTS ================= */

const STATUS_COLORS = {
  placed: "#f59e0b", // Pending
  confirmed: "#6366f1", // Approved
  shipped: "#8b5cf6", // Dispatched
  delivered: "#10b981", // Delivered
};

const Reports = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("month");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          getAllOrders({ limit: 1000 }),
          getProducts(),
        ]);
        setOrders(ordersRes?.data?.orders || ordersRes?.data || []);
        setProducts(productsRes?.data?.products || productsRes?.data || []);
      } catch (error) {
        console.error("Reports fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const monthStr = new Date().toISOString().slice(0, 7);

    const todayOrders = orders.filter(o => o.createdAt?.startsWith(todayStr));
    const monthOrders = orders.filter(o => o.createdAt?.startsWith(monthStr));

    const todaySales = todayOrders.reduce((acc, o) => acc + (o.pricing?.grandTotal || 0), 0);
    const monthSales = monthOrders.reduce((acc, o) => acc + (o.pricing?.grandTotal || 0), 0);

    return [
      { label: "Today Sales", value: `₹${todaySales.toLocaleString()}` },
      { label: "Monthly Sales", value: `₹${monthSales.toLocaleString()}` },
      { label: "Total Orders", value: orders.length.toString() },
      { label: "Product Lines", value: products.length.toString() },
    ];
  }, [orders, products]);

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mKey = d.toISOString().slice(0, 7);
      const mName = months[d.getMonth()];
      const sales = orders
        .filter(o => o.createdAt?.startsWith(mKey))
        .reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
      result.push({ month: mName, sales });
    }
    return result;
  }, [orders]);

  const statusData = useMemo(() => {
    const counts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Compiling Reports...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business <span className="text-indigo-600">Intelligence</span></h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
              Data visualizations for {user?.role} performance
            </p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setFilter("today")}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${filter === "today" ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-400 hover:bg-slate-50"
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter("month")}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${filter === "month" ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-400 hover:bg-slate-50"
                }`}
            >
              This Month
            </button>
          </div>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((item) => (
            <div key={item.label} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{item.label}</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Sales trend */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Revenue Dynamics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
                  />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8 self-start">Operational Flow</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={8}
                    strokeWidth={0}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#cbd5e1"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 w-full">
              {statusData.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] || "#cbd5e1" }}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Granular Transaction History</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Audit trail for latest operations</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Volume</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic">
                {orders.slice(0, 8).map(o => (
                  <tr key={o._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-black text-indigo-600 font-mono text-sm leading-none">#{o._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-tighter">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-8 py-5 font-black text-slate-900">₹{o.pricing?.grandTotal?.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[o.status] || "#cbd5e1" }}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{o.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
