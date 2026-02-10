import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Box, CreditCard, ArrowRight } from "lucide-react";

/**
 * Component to display incoming orders from retailers to the distributor.
 * Shows order ID, date, retailer name, total amount, and current status.
 */
const DistributorIncomingOrders = ({ orders = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm p-8 overflow-hidden transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight mb-1 flex items-center gap-2">
                        Incoming Retailer Orders
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        Latest sales to retailers
                    </p>
                </div>
                <button
                    onClick={() => navigate('/orders')}
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    View All
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-y border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold italic">
                                    No retailer orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.slice(0, 5).map(order => (
                                <tr
                                    key={order._id}
                                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/retailer-order-details/${order._id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-black font-mono text-indigo-600 text-sm group-hover:text-indigo-700">
                                            #{order._id?.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User size={12} className="text-slate-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{order.orderBy?.name || "Retailer"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 text-sm font-mono">₹{order.pricing?.grandTotal?.toLocaleString()}</span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase">{order.products?.length} Items</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DistributorIncomingOrders;
