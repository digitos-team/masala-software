import { Link } from "react-router-dom";
import { useState } from "react";

const Orders = () => {
  // 🔐 user + role
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "distributor"; // testing fallback

  // ✅ Orders state (with owner info)
  const [orders, setOrders] = useState([
    {
      id: "ORD201",
      customer: "Distributor A",
      owner: "sub-distributor",
      date: "03 Feb 2026",
      amount: "₹1,200",
      status: "Pending",
    },
    {
      id: "ORD202",
      customer: "Distributor B",
      owner: "distributor",
      date: "02 Feb 2026",
      amount: "₹3,400",
      status: "Forwarded",
    },
    {
      id: "ORD203",
      customer: "Distributor C",
      owner: "distributor",
      date: "01 Feb 2026",
      amount: "₹950",
      status: "Approved",
    },
  ]);

  // 🔥 ROLE-WISE FILTERING (CORE LOGIC)
  const filteredOrders = orders.filter((order) => {
    if (role === "admin") return true;

    if (role === "distributor") {
      return order.owner === "distributor" || order.owner === "sub-distributor";
    }

    if (role === "sub-distributor") {
      return order.owner === "sub-distributor";
    }

    return false;
  });

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

  // 🚀 Distributor → Forward
  const handleForward = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Forwarded" } : order,
      ),
    );
  };

  // 🧑‍💼 Admin → Approve
  const handleApprove = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Approved" } : order,
      ),
    );
  };

  // 🚚 Admin → Dispatch
  const handleDispatch = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Dispatched" } : order,
      ),
    );
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Order Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage orders based on user role.
          </p>
        </div>

        {role !== "admin" && (
          <Link
            to="/orders/create"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md"
          >
            <span className="mr-2 text-lg">+</span> Create Order
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-indigo-600">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-indigo-600 font-semibold hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
                    >
                      View
                    </Link>

                    {/* Distributor */}
                    {role === "distributor" && order.status === "Pending" && (
                      <button
                        onClick={() => handleForward(order.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                      >
                        Forward
                      </button>
                    )}

                    {/* Admin */}
                    {role === "admin" && order.status === "Forwarded" && (
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                      >
                        Approve
                      </button>
                    )}

                    {role === "admin" && order.status === "Approved" && (
                      <button
                        onClick={() => handleDispatch(order.id)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
                      >
                        Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t text-center">
          <span className="text-xs text-slate-400">
            Showing {filteredOrders.length} orders
          </span>
        </div>
      </div>
    </div>
  );
};

export default Orders;
