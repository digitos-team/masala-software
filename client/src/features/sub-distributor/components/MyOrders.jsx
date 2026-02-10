import { Clock, CheckCircle2, MoreHorizontal, Package } from "lucide-react";
import { useSubDistributorData } from "../hooks/useSubDistributorData";
import dayjs from "dayjs";

const MyOrders = () => {
  const { orders, loading } = useSubDistributorData();

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "confirmed":
        return "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20";
      case "pending":
      case "placed":
        return "bg-amber-50 text-amber-600 ring-1 ring-amber-600/20";
      case "shipped":
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-600/20";
      case "cancelled":
        return "bg-red-50 text-red-600 ring-1 ring-red-600/20";
      default:
        return "bg-slate-50 text-slate-600 ring-1 ring-slate-600/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "confirmed":
        return <CheckCircle2 size={14} />;
      case "shipped":
        return <Package size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">My Orders</h3>
        </div>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">My Orders</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Track your recent inventory requests ({orders?.length || 0} total)
          </p>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto">
        {orders && orders.length > 0 ? (
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
                  key={o._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                      #{o.Orderno || o._id?.slice(-6)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold capitalize ${getStatusStyles(o.status)}`}
                    >
                      {getStatusIcon(o.status)}
                      {o.status}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {dayjs(o.createdAt).format("MMM DD, YYYY")}
                  </td>
                  <td className="p-4 text-right font-black text-slate-900 text-base">
                    ₹{o.pricing?.grandTotal?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <Package className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-semibold">No orders yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Create your first order to get started
            </p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      {orders && orders.length > 0 && (
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          <p className="text-[11px] font-medium text-slate-500 italic">
            Distributor/Admin typically approves orders within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

