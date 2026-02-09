import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminSalesChart = () => {
  const salesData = [
    { month: "Jan", sales: 120000 },
    { month: "Feb", sales: 145000 },
    { month: "Mar", sales: 98000 },
    { month: "Apr", sales: 165000 },
    { month: "May", sales: 210000 },
  ];

  const formatCurrency = (value) => `₹${(value / 1000).toFixed(0)}k`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-slate-900/95 backdrop-blur text-white px-3 py-2 rounded-xl shadow-xl border border-slate-800 text-xs">
        <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-base sm:text-lg font-black text-indigo-400">
          ₹{payload[0].value.toLocaleString()}
        </p>
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
          <LineChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 3,
              }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100 text-center sm:text-left">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Avg. Monthly
          </p>
          <p className="text-sm font-black text-slate-800">₹1.4L</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Peak Month
          </p>
          <p className="text-sm font-black text-slate-800">May</p>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:text-right">
            Target Gap
          </p>
          <p className="text-sm font-black text-indigo-600 sm:text-right">
            ₹40k Left
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesChart;
