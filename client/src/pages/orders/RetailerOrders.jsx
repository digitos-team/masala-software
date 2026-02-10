import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../api/admin/order.api";
import { useAuth } from "../../context/AuthContext";
import {
    Search,
    Filter,
    ArrowLeft,
    User,
    Box,
    CreditCard,
    Calendar,
    ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";

const RetailerOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getAllOrders({ limit: 1000 });
                const allOrders = data?.data?.orders || data?.data || [];

                // Filter: Orders placed TO the current user (Distributor) by someone else (Retailer)
                const myId = user?._id;
                const incoming = allOrders.filter(o => {
                    const distId = o.distributorId?._id || o.distributorId;
                    return distId === myId && o.orderBy?._id !== myId && o.orderBy !== myId;
                });

                setOrders(incoming);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load retailer orders");
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchOrders();
    }, [user?._id]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o =>
            o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.orderBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading Retailer Orders...</div>;

    return (
        <div className="bg-[#F4F7FE] min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Retailer Orders</h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                                Incoming sales from your network
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <button className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Retailer</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items & Amount</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold italic text-sm">
                                            No retailer orders matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr
                                            key={order._id}
                                            className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/retailer-order-details/${order._id}`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black font-mono text-indigo-600 text-sm tracking-tighter">
                                                        #{order._id?.slice(-6).toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
                                                        <Calendar size={10} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                        <User size={14} className="text-slate-500" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{order.orderBy?.name || "Unknown Retailer"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm font-mono">
                                                        <CreditCard size={12} className="text-slate-400" />
                                                        ₹{order.pricing?.grandTotal?.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                        <Box size={10} />
                                                        {order.products?.length} Products
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    order.status === 'placed' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                                    <ChevronRight size={20} strokeWidth={3} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailerOrders;
