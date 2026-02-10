import {
  TrendingUp,
  ShoppingBag,
  Clock,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";
import { useSubDistributorData } from "../hooks/useSubDistributorData";

const SubDistributorStats = () => {
  const { stats, loading } = useSubDistributorData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm animate-pulse"
          >
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsDisplay = [
    {
      title: "Total Sales",
      value: `₹${stats?.totalSales?.toLocaleString() || 0}`,
      icon: <IndianRupee size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "All time",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "All orders placed",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: <Clock size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Awaiting approval",
    },
    {
      title: "Active Products",
      value: stats?.activeProducts || 0,
      icon: <TrendingUp size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "Available to order",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsDisplay.map((s) => (
        <div
          key={s.title}
          className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`${s.bg} ${s.color} p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300`}
            >
              {s.icon}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={12} />
              LIVE
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1 tracking-tight">
              {s.title}
            </p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {s.value}
            </h2>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              {s.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubDistributorStats;

