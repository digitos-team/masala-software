import React, { useState } from "react";
import { Send, CheckCircle2, Box, User, CreditCard } from "lucide-react";

const DistributorPendingActions = () => {
  const [pendingOrders, setPendingOrders] = useState([
    {
      id: "ORD301",
      customer: "Sub Dist A",
      product: "Biryani Masala (100g)",
      amount: "₹1,200",
      status: "Pending",
    },
    {
      id: "ORD302",
      customer: "Sub Dist B",
      product: "Chicken Masala (50g)",
      amount: "₹750",
      status: "Pending",
    },
    {
      id: "ORD303",
      customer: "Sub Dist C",
      product: "Garam Masala (100g)",
      amount: "₹980",
      status: "Pending",
    },
  ]);

  const handleForward = (orderId) => {
    // Add a small animation feel before removing
    setPendingOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full mt-10 transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Pending Actions
          </h3>
          <p className="text-xs font-bold text-amber-500 uppercase tracking-tighter mt-1 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {pendingOrders.length} Orders awaiting approval
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto">
        {pendingOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="bg-emerald-50 p-4 rounded-full mb-4">
              <CheckCircle2 className="text-emerald-500 w-10 h-10" />
            </div>
            <h4 className="text-slate-800 font-bold text-lg">All caught up!</h4>
            <p className="text-slate-500 text-sm max-w-[200px]">
              No pending orders to forward right now.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Order & Customer
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Product Details
                </th>
                <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingOrders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-indigo-600 font-black text-sm tracking-tighter">
                        #{order.id}
                      </span>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                        <User size={12} />
                        <span className="font-semibold">{order.customer}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-slate-700 text-[13px] font-bold">
                        <Box size={14} className="text-slate-400" />
                        {order.product}
                      </div>
                      <div className="flex items-center gap-1 text-slate-900 text-xs mt-1 font-black">
                        <CreditCard size={12} className="text-slate-400" />
                        {order.amount}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleForward(order.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-md active:scale-95 group-hover:shadow-indigo-200"
                    >
                      <Send size={14} />
                      Forward
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      {pendingOrders.length > 0 && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 text-center font-medium italic">
            * Forwarding sends order details to the Admin for final dispatch.
          </p>
        </div>
      )}
    </div>
  );
};

export default DistributorPendingActions;
