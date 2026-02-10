import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder, updateOrderStatus } from "../../api/admin/order.api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Truck,
    User,
    Calendar,
    Package,
    CreditCard,
    MapPin
} from "lucide-react";

const RetailerOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await getOrder(id);
            setOrder(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load order details");
            navigate("/retailer-orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOrderDetails();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        let reason = "";
        if (newStatus === "cancelled" || newStatus === "returned") {
            reason = window.prompt(`Please enter a reason for ${newStatus}:`);
            if (reason === null) return; // Cancelled prompt
        }

        try {
            await updateOrderStatus(id, newStatus, reason);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrderDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading Details...</div>;
    if (!order) return null;

    const isCancelled = order.status === "cancelled";
    const isReturned = order.status === "returned";

    return (
        <div className="bg-[#F4F7FE] min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate("/retailer-orders")}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Retailer Orders
                    </button>

                    <div className="flex items-center gap-4">
                        {!isCancelled && !isReturned && (
                            <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Status:</span>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    className="bg-slate-50 border-none text-xs font-black uppercase tracking-widest text-indigo-600 focus:ring-0 cursor-pointer rounded-lg px-3 py-1.5"
                                >
                                    <option value="placed">Placed</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="returned">Returned</option>
                                </select>
                            </div>
                        )}
                        {isCancelled && (
                            <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest border border-red-100">
                                Order Cancelled
                            </span>
                        )}
                        {isReturned && (
                            <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-black uppercase text-[10px] tracking-widest border border-amber-100">
                                Order Returned
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {order.status}
                                        </span>
                                        <span className="text-slate-300 text-xs">|</span>
                                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Order #{order._id?.slice(-8).toUpperCase()}</h1>
                                </div>
                            </div>

                            {/* Products Table */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Items</p>
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                                                <Package size={20} className="text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{item.name || item.productId?.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                    QTY: {item.quantity} × ₹{item.unitPrice}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-black text-slate-900 font-mono">₹{(item.quantity * item.unitPrice).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="font-mono">₹{order.pricing?.subTotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Tax Amount</span>
                                    <span className="font-mono">₹{order.pricing?.taxAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 mt-2">
                                    <span className="text-lg font-black text-slate-800 uppercase tracking-tight">Grand Total</span>
                                    <span className="text-3xl font-black text-indigo-600 font-mono tracking-tighter">
                                        ₹{order.pricing?.grandTotal?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Shipping */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" /> Retailer Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Name</p>
                                        <p className="font-bold text-slate-700">{order.orderBy?.name || "Retailer Name"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Email</p>
                                        <p className="font-bold text-slate-700 text-sm">{order.orderBy?.email || "No email"}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <MapPin size={18} className="text-slate-300 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping Address</p>
                                            <p className="font-bold text-slate-700 text-sm leading-relaxed">
                                                {order.delivery?.address || "No address provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-70">Payment Status</h3>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-widest">Order Amount</p>
                                    <p className="text-2xl font-black font-mono">₹{order.pricing?.grandTotal?.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Internal Notes</p>
                                <p className="text-[11px] font-bold leading-relaxed italic opacity-90">
                                    {order.status === 'placed' ? "Awaiting your confirmation to initiate fulfillment." : "Order is being processed."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Order Timeline</h3>
                            <div className="space-y-6 relative">
                                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                                <div className="flex items-center gap-4 relative">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 border-4 border-white shadow-sm z-10"></div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Order Placed</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {order.status !== 'placed' && (
                                    <div className="flex items-center gap-4 relative">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500 border-4 border-white shadow-sm z-10"></div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Confirmed</p>
                                            <p className="text-[10px] text-slate-400 font-bold">Successfully approved</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailerOrderDetails;
