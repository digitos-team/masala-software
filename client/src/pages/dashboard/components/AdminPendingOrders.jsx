import React, { useState } from "react";
import { Send, CheckCircle2, Box, User, CreditCard, XCircle, Check } from "lucide-react";
import { updateOrderStatus } from "../../../api/admin/order.api";
import { toast } from "react-toastify";

const AdminPendingOrders = ({ orders = [], onOrderUpdate }) => {
    const [processing, setProcessing] = useState(null);

    const handleApprove = async (orderId) => {
        try {
            setProcessing(orderId);
            await updateOrderStatus(orderId, "confirmed");
            toast.success(`Order #${orderId.slice(-6).toUpperCase()} Approved`);
            if (onOrderUpdate) onOrderUpdate(); // Refresh parent data
        } catch (error) {
            console.error("Approval failed", error);
            toast.error("Failed to approve order");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (orderId) => {
        if (!window.confirm("Are you sure you want to reject this order?")) return;
        try {
            setProcessing(orderId);
            await updateOrderStatus(orderId, "cancelled", "Admin Rejected");
            toast.info(`Order #${orderId.slice(-6).toUpperCase()} Rejected`);
            if (onOrderUpdate) onOrderUpdate();
        } catch (error) {
            console.error("Rejection failed", error);
            toast.error("Failed to reject order");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                        Orders Awaiting Approval
                    </h3>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-tighter mt-1 flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        {orders.length} Pending Actions
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-emerald-50 p-4 rounded-full mb-4">
                            <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                        </div>
                        <h4 className="text-slate-800 font-bold text-lg">All caught up!</h4>
                        <p className="text-slate-500 text-sm max-w-[200px]">
                            No pending orders requiring approval.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Order Details
                                </th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Summary
                                </th>
                                <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="group hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-indigo-600 font-black text-sm tracking-tighter">
                                                #{order._id?.slice(-6).toUpperCase()}
                                            </span>
                                            <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-1">
                                                <User size={10} />
                                                <span className="font-semibold">{order.invoiceNumber || "N/A"}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1 text-slate-700 text-[11px] font-bold">
                                                <Box size={12} className="text-slate-400" />
                                                {order.products?.length || 0} items
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-900 text-xs mt-1 font-black">
                                                <CreditCard size={12} className="text-slate-400" />
                                                ₹{order.pricing?.grandTotal?.toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleReject(order._id)}
                                                disabled={processing === order._id}
                                                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all border border-rose-100"
                                                title="Reject Order"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(order._id)}
                                                disabled={processing === order._id}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-md active:scale-95 group-hover:shadow-indigo-200"
                                            >
                                                {processing === order._id ? (
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Check size={12} strokeWidth={3} />
                                                )}
                                                Approve
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Footer Info */}
            {orders.length > 0 && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                    <p className="text-[9px] text-slate-400 text-center font-medium italic">
                        * Approving moves the order to dispatch queue.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminPendingOrders;
