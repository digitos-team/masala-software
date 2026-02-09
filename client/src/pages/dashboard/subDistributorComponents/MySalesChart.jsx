import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MySalesChart = () => {
  const data = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 1800 },
    { day: "Wed", sales: 900 },
    { day: "Thu", sales: 2200 },
    { day: "Fri", sales: 1500 },
    { day: "Sat", sales: 1900 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h3 className="text-lg font-bold mb-4">Weekly Sales Overview</h3>

      <div className="w-full h-[280px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MySalesChart;
