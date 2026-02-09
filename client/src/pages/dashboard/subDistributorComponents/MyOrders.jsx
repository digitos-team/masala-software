import { Clock, CheckCircle2, MoreHorizontal } from "lucide-react";

const MyOrders = () => {
  const orders = [
    { id: "ORD301", status: "Pending", amount: "₹450", date: "Oct 24, 2023" },
    {
      id: "ORD302",
      status: "Approved",
      amount: "₹1,200",
      date: "Oct 23, 2023",
    },
    { id: "ORD303", status: "Pending", amount: "₹800", date: "Oct 22, 2023" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20";
      case "Pending":
        return "bg-amber-50 text-amber-600 ring-1 ring-amber-600/20";
      default:
        return "bg-slate-50 text-slate-600 ring-1 ring-slate-600/20";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">My Orders</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Track your recent inventory requests
          </p>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
                Order Details
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
                Status
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
                Date
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="p-4">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                    #{o.id}
                  </span>
                </td>
                <td className="p-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold ${getStatusStyles(o.status)}`}
                  >
                    {o.status === "Approved" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {o.status}
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600 font-medium">
                  {o.date || "Today"}
                </td>
                <td className="p-4 text-right font-black text-slate-900 text-base">
                  {o.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        <p className="text-[11px] font-medium text-slate-500 italic">
          Distributor/Admin typically approves orders within 24 hours.
        </p>
      </div>
    </div>
  );
};

export default MyOrders;
