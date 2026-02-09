import React from "react";
import { User2, ArrowUpRight, MoreVertical, LayoutGrid } from "lucide-react";

const SubDistributorTable = () => {
  const subDistributorSales = [
    {
      name: "Sub Dist A",
      today: "2,100",
      month: "32,000",
      orders: 18,
      performance: 85,
    },
    {
      name: "Sub Dist B",
      today: "1,800",
      month: "29,500",
      orders: 15,
      performance: 70,
    },
    {
      name: "Sub Dist C",
      today: "1,400",
      month: "26,000",
      orders: 12,
      performance: 45,
    },
    {
      name: "Sub Dist D",
      today: "1,500",
      month: "24,500",
      orders: 11,
      performance: 60,
    },
  ];

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/40">
      {/* Table Header Section */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <LayoutGrid size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Network Performance
          </h3>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Member Details
              </th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Daily Revenue
              </th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Monthly (MTD)
              </th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">
                Orders
              </th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">
                Growth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subDistributorSales.map((sub) => (
              <tr
                key={sub.name}
                className="group hover:bg-indigo-50/30 transition-all duration-200"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm group-hover:bg-white group-hover:text-indigo-600 transition-all">
                      {sub.name.charAt(sub.name.length - 1)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 tracking-tight">
                        {sub.name}
                      </p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                        Platinum Partner
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{sub.today}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-black flex items-center gap-0.5">
                      <ArrowUpRight size={10} /> 12%
                    </span>
                  </div>
                </td>

                <td className="p-5">
                  <div className="w-full max-w-[120px]">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-700">
                        ₹{sub.month}
                      </span>
                    </div>
                    {/* Progress Bar for Monthly Target */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000 group-hover:bg-indigo-600"
                        style={{ width: `${sub.performance}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="p-5 text-center">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg font-black text-slate-900 text-sm border border-slate-200 group-hover:bg-white transition-colors">
                    {sub.orders}
                  </span>
                </td>

                <td className="p-5 text-right font-black text-indigo-600 text-base italic tracking-tighter">
                  Active
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-slate-50/30 border-t border-slate-50 text-center">
        <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-all">
          View Detailed Analytics
        </button>
      </div>
    </div>
  );
};

export default SubDistributorTable;
