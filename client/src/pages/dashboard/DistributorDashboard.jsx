import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DistributorSalesChart from "./distributorcomponents/DistributorSalesChart";
import DistributorPendingActions from "./distributorcomponents/DistributorPendingActions";
import { getProducts } from "../../api/admin/product.api";
import { getAllOrders } from "../../api/admin/order.api";
import { getPaymentStats } from "../../api/admin/payment.api";
import {
  AlertTriangle,
  Trophy,
  Target,
  Plus,
  Activity,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Wallet,
} from "lucide-react";

const DistributorDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentStats, setPaymentStats] = useState({ today: 0, month: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const currentMonth = new Date().toISOString().slice(0, 7);

        const [ordersRes, productsRes, todayPayments, monthPayments] = await Promise.all([
          getAllOrders({ limit: 1000 }),
          getProducts(),
          getPaymentStats({ startDate: today }),
          getPaymentStats({ startDate: `${currentMonth}-01` })
        ]);

        setOrders(ordersRes?.data?.orders || ordersRes?.data || []);
        setProducts(productsRes?.data?.products || productsRes?.data || []);
        setPaymentStats({
          today: todayPayments?.data?.totalRevenue || 0,
          month: monthPayments?.data?.totalRevenue || 0
        });
      } catch (error) {
        console.error("Distributor Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toISOString().slice(0, 7);

    const todayOrders = orders.filter((o) => o.createdAt?.startsWith(today) && o.status !== "cancelled");
    const monthOrders = orders.filter((o) => o.createdAt?.startsWith(currentMonth) && o.status !== "cancelled");

    const todaySales = todayOrders.reduce((acc, o) => acc + (o.pricing?.grandTotal || 0), 0);
    const monthSales = monthOrders.reduce((acc, o) => acc + (o.pricing?.grandTotal || 0), 0);

    const lowStockAlerts = products.filter(p => p.stock <= (p.minStockAlert || 10));

    return {
      todaySales,
      monthSales,
      todayCollection: paymentStats.today,
      monthCollection: paymentStats.month,
      totalOrders: orders.length,
      lowStockAlerts: lowStockAlerts.slice(0, 3)
    };
  }, [orders, products, paymentStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold">
        Initializing Console...
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FE] min-h-screen font-sans p-4 md:p-8 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* --- 👑 HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 p-6 rounded-[2rem] backdrop-blur-md border border-white/60 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                System Live • <span className="text-slate-900">Masala Pro v2.0</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Distributor <span className="text-indigo-600">Console</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/orders/create')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <Plus size={18} strokeWidth={3} /> New Order
            </button>
          </div>
        </div>

        {/* --- 📊 TOP LAYER: ANALYTICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm overflow-hidden p-2">
            <DistributorSalesChart orders={orders} />
          </div>

          {/* REVENUE GOAL */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] mb-1">Paid to Admin (Monthly)</h3>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                    ₹{stats.monthCollection.toLocaleString()}
                  </h4>
                  <ArrowUpRight className="text-emerald-500" size={24} strokeWidth={3} />
                </div>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-6 transition-transform">
                <Wallet size={28} />
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Paid (Today)</span>
                  <span className="text-emerald-600 font-black">₹{stats.todayCollection.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                  <span>Billed (This Month)</span>
                  <span className="text-indigo-600 font-black">₹{stats.monthSales.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50 p-[2px]">
                  <div
                    className="bg-emerald-600 h-full rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    style={{ width: `${Math.min((stats.monthCollection / stats.monthSales) * 100 || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 🏥 MIDDLE LAYER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* STOCK HEALTH */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
              <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 text-sm uppercase">
                <Activity size={16} className="text-rose-500" /> Stock Health
              </h3>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-1 rounded-lg">
                {stats.lowStockAlerts.length} ALERTS
              </span>
            </div>

            <div className="space-y-4">
              {stats.lowStockAlerts.map((item) => (
                <div key={item._id} className="flex items-center justify-between group p-1 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-rose-500">{item.stock} left</span>
                </div>
              ))}
              {stats.lowStockAlerts.length === 0 && (
                <p className="text-xs text-slate-400 italic">All stock levels healthy.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <DistributorPendingActions orders={orders.filter(o => o.status === "placed")} />
          </div>

          {/* TOTAL ORDERS */}
          <div className="lg:col-span-1 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white relative overflow-hidden group">
            <Trophy className="absolute right-[-10px] bottom-[-10px] text-white/5 w-32 h-32 rotate-12" />
            <h3 className="font-black tracking-[0.1em] text-[10px] uppercase text-indigo-400 mb-8">Overall Performance</h3>
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-2xl shadow-lg border border-indigo-400/20">
                {stats.totalOrders}
              </div>
              <div>
                <p className="font-black text-white text-xl tracking-tight leading-none">Total Orders</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Placed till date</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 border border-white/5"
            >
              View Detailed Metrics
            </button>
          </div>
        </div>

        {/* --- Network Section --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm p-8 overflow-hidden">
          <h3 className="font-black text-slate-900 text-lg tracking-tight mb-2">My Recent Sales</h3>
          <p className="text-slate-400 text-xs font-bold mb-6">Latest 5 orders placed through this account</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Products</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-black font-mono text-indigo-600 text-sm">#{order._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{order.products?.length || 0} items</td>
                    <td className="px-6 py-4 font-black text-slate-900 text-sm">₹{order.pricing?.grandTotal?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase">{order.status}</span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold italic">No recent sales found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;
