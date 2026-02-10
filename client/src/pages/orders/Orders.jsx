import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllOrders } from "../../api/admin/order.api";
import { toast } from "react-toastify";

const Orders = () => {
  // 🔐 user + role
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "admin";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      const allOrders = data?.data?.orders || data?.data || [];

      // For distributors, only show orders THEY placed (My Purchases)
      if (role === 'distributor') {
        const myPurchases = allOrders.filter(o => {
          const orderById = o.orderBy?._id || o.orderBy;
          return orderById === user._id;
        });
        setOrders(myPurchases);
      } else {
        setOrders(allOrders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [role, user._id]);

  // 🎨 Status styles
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Forwarded":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Approved":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Dispatched":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-2 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Order Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage orders based on your role.
          </p>
        </div>

        {role !== "admin" && (
          <Link
            to="/orders/create"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95"
          >
            <span className="mr-2 text-lg">+</span> Create Order
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>

                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 italic">No orders found.</td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black font-mono text-indigo-600 text-sm">
                      #{order._id?.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      }) : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{order.pricing?.grandTotal?.toLocaleString() || order.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors text-sm border border-transparent hover:border-indigo-100"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {orders.length} Records Found
          </span>
        </div>
      </div>
    </div>
  );
};

export default Orders;
