import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DistributorSalesChart = ({ orders = [], payments = [] }) => {
  const chartData = useMemo(() => {
    // Group by month for the last 6 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6 = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = months[d.getMonth()];
      const mKey = d.toISOString().slice(0, 7); // YYYY-MM

      const monthlySales = orders
        .filter(o => o.createdAt?.startsWith(mKey) && o.status !== "cancelled")
        .reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

      const monthlyCollection = payments
        .filter(p => p.paidAt?.startsWith(mKey))
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      last6.push({
        name: mName,
        billed: Math.round(monthlySales),
        collected: Math.round(monthlyCollection)
      });
    }
    return last6;
  }, [orders, payments]);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Revenue <span className="text-emerald-600">Collection</span>
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Billed vs Collected (Last 6 Months)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collected</span>
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                padding: "12px",
                fontSize: "12px",
                fontWeight: "bold"
              }}
              formatter={(value, name) => [`₹${value.toLocaleString()}`, name === "billed" ? "Billed" : "Collected"]}
            />
            <Area
              type="monotone"
              dataKey="billed"
              stroke="#4f46e5"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorBilled)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="collected"
              stroke="#10b981"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorCollected)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributorSalesChart;
