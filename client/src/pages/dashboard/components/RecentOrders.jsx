const RecentOrders = ({ orders = [] }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
      case "Pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
      default:
        return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300";
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full hidden sm:block" />
          <div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-800">
              Recent Orders
            </h3>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
              Live Transactions
            </p>
          </div>
        </div>

        <button className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-600 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition border border-indigo-100">
          View All
        </button>
      </div>

      {/* TABLE VIEW (Tablet & Desktop) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Order ID
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Distributor
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="group hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100">
                    #{order.id}
                  </span>
                </td>

                <td className="px-6 py-4 font-bold text-slate-700">
                  {order.distributor}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles(
                      order.status,
                    )}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current hidden md:block animate-pulse" />
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-black text-slate-900 tabular-nums bg-slate-100 px-3 py-1 rounded-lg">
                    {order.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden divide-y divide-slate-100">
        {orders.map((order) => (
          <div key={order.id} className="p-4 active:bg-slate-50 transition">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                #{order.id}
              </span>

              <span
                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${getStatusStyles(
                  order.status,
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Distributor
                </p>
                <p className="text-sm font-black text-slate-800">
                  {order.distributor}
                </p>
              </div>

              <p className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                {order.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-bold text-slate-400 italic">
            No recent orders found
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
