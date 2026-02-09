const DistributorTable = ({ distributors }) => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-800">
            Distributor-wise Sales
          </h3>
          <p className="text-xs font-medium text-slate-400 sm:hidden">
            Swipe horizontally to view →
          </p>
        </div>

        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100">
          Live Updates
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Distributor
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Today
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                This Month
              </th>
              <th className="px-4 sm:px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                Orders
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {distributors.map((dist) => (
              <tr
                key={dist.name}
                className="group hover:bg-indigo-50/40 transition-colors"
              >
                {/* Distributor */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs
                                    group-hover:bg-indigo-600 group-hover:text-white transition"
                    >
                      {dist.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">
                      {dist.name}
                    </span>
                  </div>
                </td>

                {/* Today */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-bold tabular-nums text-sm">
                      {dist.today}
                    </span>
                    <span className="hidden sm:inline text-[10px] text-emerald-500 font-black">
                      ↑ 12%
                    </span>
                  </div>
                </td>

                {/* Month */}
                <td className="px-4 sm:px-6 py-4">
                  <span className="text-slate-600 font-semibold tabular-nums text-sm">
                    {dist.month}
                  </span>
                </td>

                {/* Orders */}
                <td className="px-4 sm:px-6 py-4 text-right">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-slate-900 text-white
                                   group-hover:bg-indigo-600 transition"
                  >
                    {dist.orders}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile scroll indicator */}
      <div className="sm:hidden px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-center">
        <div className="w-12 h-1 bg-slate-300 rounded-full" />
      </div>
    </div>
  );
};

export default DistributorTable;
