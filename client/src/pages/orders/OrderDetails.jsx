import React from "react";
import { useParams } from "react-router-dom";

const ORDER_STEPS = [
  "Pending",
  "Forwarded",
  "Approved",
  "Dispatched",
  "Delivered",
];

const OrderDetails = () => {
  const { id } = useParams();

  const order = {
    id,
    customer: "Distributor A",
    date: "03 Feb 2026",
    product: "Biryani Masala (100g)",
    quantity: 5,
    amount: "₹600",
    status: "Pending", // 🔥 change karke test kar sakta hai
  };

  const currentIndex = ORDER_STEPS.indexOf(order.status);

  return (
    <div className="p-2 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Order Details – #{id}
      </h1>

      {/* ORDER INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <Detail label="Order ID" value={order.id} isBold />
        <Detail label="Customer" value={order.customer} />
        <Detail label="Date" value={order.date} />
        <Detail label="Product" value={order.product} />
        <Detail label="Quantity" value={order.quantity} />
        <Detail label="Amount" value={order.amount} isBold />

        {/* STATUS BADGE */}
        <div className="flex justify-between items-center py-4">
          <span className="text-sm text-slate-500">Current Status</span>
          <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-amber-500">
            {order.status}
          </span>
        </div>
      </div>

      {/* 🔥 STATUS TIMELINE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Order Status Timeline
        </h3>

        <div className="space-y-4">
          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step} className="flex items-center gap-4">
                {/* DOT */}
                <div
                  className={`w-4 h-4 rounded-full ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isCurrent
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                  }`}
                />

                {/* LINE */}
                <div className="flex-1 h-px bg-slate-200" />

                {/* LABEL */}
                <span
                  className={`text-sm font-semibold ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                        ? "text-indigo-600"
                        : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, isBold }) => (
  <div className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span
      className={`text-sm ${
        isBold ? "font-bold text-slate-900" : "text-slate-700"
      }`}
    >
      {value}
    </span>
  </div>
);

export default OrderDetails;
