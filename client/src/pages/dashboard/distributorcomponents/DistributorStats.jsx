import React from "react";
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";

const DistributorStats = () => {
  const stats = [
    {
      title: "Today Sales",
      value: "₹8,200",
      icon: <IndianRupee size={22} />,
      trend: "+12.5%",
      isPositive: true,
      color: "blue",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      title: "Monthly Sales",
      value: "₹1,75,000",
      icon: <TrendingUp size={22} />,
      trend: "+8.2%",
      isPositive: true,
      color: "emerald",
      glow: "group-hover:shadow-emerald-500/20",
    },
    {
      title: "My Orders",
      value: "57",
      icon: <ShoppingBag size={22} />,
      trend: "+4 today",
      isPositive: true,
      color: "indigo",
      glow: "group-hover:shadow-indigo-500/20",
    },
    {
      title: "Pending Orders",
      value: "9",
      icon: <Clock size={22} />,
      trend: "-2 from yesterday",
      isPositive: false,
      color: "amber",
      glow: "group-hover:shadow-amber-500/20",
    },
  ];

  const colorMap = {
    blue: "from-blue-500/10 to-transparent text-blue-600 border-blue-100 bg-blue-50/50",
    emerald:
      "from-emerald-500/10 to-transparent text-emerald-600 border-emerald-100 bg-emerald-50/50",
    indigo:
      "from-indigo-500/10 to-transparent text-indigo-600 border-indigo-100 bg-indigo-50/50",
    amber:
      "from-amber-500/10 to-transparent text-amber-600 border-amber-100 bg-amber-50/50",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((item) => (
        <div
          key={item.title}
          className={`group relative overflow-hidden bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${item.glow}`}
        >
          {/* Decorative Gradient Background */}
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl ${item.color === "blue" ? "from-blue-400" : item.color === "emerald" ? "from-emerald-400" : item.color === "indigo" ? "from-indigo-400" : "from-amber-400"}`}
          ></div>

          <div className="relative z-10">
            {/* Header: Icon & Trend */}
            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-3 rounded-2xl border bg-gradient-to-b ${colorMap[item.color]} transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110`}
              >
                {item.icon}
              </div>

              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm ${
                  item.isPositive
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                }`}
              >
                {item.isPositive ? (
                  <ArrowUpRight size={12} strokeWidth={3} />
                ) : (
                  <ArrowDownRight size={12} strokeWidth={3} />
                )}
                {item.trend}
              </div>
            </div>

            {/* Value & Title */}
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {item.title}
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">
                {item.value}
              </h2>
            </div>

            {/* Interactive Footer Indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full w-0 group-hover:w-full transition-all duration-700 delay-100 ${item.color === "blue" ? "bg-blue-500" : item.color === "emerald" ? "bg-emerald-500" : item.color === "indigo" ? "bg-indigo-500" : "bg-amber-500"}`}
                ></div>
              </div>
              <span className="text-[9px] font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
                LIVE DATA
              </span>
            </div>
          </div>

          {/* Large Ghost Icon Background */}
          <div className="absolute -right-2 -bottom-4 text-slate-50 opacity-[0.05] group-hover:opacity-[0.1] group-hover:-rotate-12 transition-all duration-700">
            {React.cloneElement(item.icon, { size: 100 })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributorStats;
