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

const AdminSalesChart = ({ orders = [], payments = [] }) => {
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6 = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = months[d.getMonth()];
      const mKey = d.toISOString().slice(0, 7);

      const monthlySales = orders
        .filter(o => o.createdAt?.startsWith(mKey) && o.status !== "cancelled")
        .reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

      const monthlyCollection = payments
        .filter(p => p.paidAt?.startsWith(mKey))
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      last6.push({
        month: mName,
        billed: Math.round(monthlySales),
        collected: Math.round(monthlyCollection)
      });
    }
    return last6;
  }, [orders, payments]);

  const stats = useMemo(() => {
    const avg = chartData.reduce((acc, curr) => acc + curr.billed, 0) / chartData.length;
    const peakMonth = [...chartData].sort((a, b) => b.billed - a.billed)[0];
    return { avg, peakMonth };
  }, [chartData]);

  const formatCurrency = (value) => `₹${(value / 1000).toFixed(0)}k`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-slate-900/95 backdrop-blur text-white px-3 py-2 rounded-xl shadow-xl border border-slate-800 text-xs">
        <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="space-y-1">
          <p className="flex justify-between gap-4 font-black">
            <span className="text-indigo-400">Billed:</span>
            <span>₹{payload[0]?.value.toLocaleString()}</span>
          </p>
          <p className="flex justify-between gap-4 font-black">
            <span className="text-emerald-400">Collected:</span>
            <span>₹{payload[1]?.value.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-800">
            Revenue Analytics
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            Growth performance over time
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              +12.5%
            </span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[220px] sm:h-[280px] lg:h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="billedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
              }}
              tickFormatter={formatCurrency}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
            />

            <Area
              type="monotone"
              dataKey="billed"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#billedGradient)"
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="collected"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#collectedGradient)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100 text-center sm:text-left">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Avg. Monthly (Billed)
          </p>
          <p className="text-sm font-black text-slate-800">₹{(stats.avg / 1000).toFixed(1)}k</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Peak Month
          </p>
          <p className="text-sm font-black text-slate-800">{stats.peakMonth.month}</p>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:text-right">
            Collection Status
          </p>
          <p className="text-sm font-black text-emerald-600 sm:text-right">
            ₹{(stats.peakMonth.collected / 1000).toFixed(1)}k Peak Coll.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesChart;
