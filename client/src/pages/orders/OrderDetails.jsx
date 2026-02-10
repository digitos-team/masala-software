import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder, updateOrderStatus } from "../../api/admin/order.api";
import { createPayment, getPaymentsByOrder } from "../../api/admin/payment.api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ArrowLeft, Edit, XCircle, CheckCircle, Truck, CreditCard, History, Plus } from "lucide-react";
import CommonModal from "../../components/CommonModal";

const ORDER_STEPS = [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "UPI",
    transactionId: "",
  });

  // Fetch Order and Payments
  const init = async () => {
    try {
      const [orderRes, paymentRes] = await Promise.all([
        getOrder(id),
        getPaymentsByOrder(id)
      ]);
      setOrder(orderRes.data);
      setPayments(paymentRes.data?.payments || []);
    } catch (error) {
      toast.error("Failed to fetch details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [id]);

  // Payment Stats
  const paymentStats = useMemo(() => {
    const totalPaid = payments
      .filter(p => p.Paymentstatus === "Completed")
      .reduce((acc, p) => acc + p.amount, 0);
    const balance = order ? (order.pricing.grandTotal - totalPaid) : 0;
    return { totalPaid, balance };
  }, [payments, order]);

  // Handle Log Payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || !paymentForm.transactionId) {
      return toast.warning("Please fill all fields");
    }

    setSubmittingPayment(true);
    try {
      await createPayment({
        orderId: id,
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        transactionId: paymentForm.transactionId,
        Paymentstatus: "Completed", // Assuming manual confirmation for now or backend verification
      });
      toast.success("Payment logged successfully!");
      setShowPaymentModal(false);
      setPaymentForm({ amount: "", method: "UPI", transactionId: "" });
      init(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log payment");
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Handle Status Update (Admin)
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      init(); // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Handle Cancel (Distributor)
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await updateOrderStatus(id, "cancelled", "User requested cancellation");
      toast.success("Order cancelled successfully");
      init();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading order...</div>;
  if (!order) return null;

  const currentStepIndex = ORDER_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const isReturned = order.status === "returned";

  // Determine if editable (Placed status only)
  const canEdit = order.status === "placed" && !isCancelled;

  return (
    <div className="p-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/orders")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} /> Back to Orders
        </button>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <button
                onClick={() => navigate(`/orders/edit/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-bold"
              >
                <Edit size={16} /> Edit Order
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-bold"
              >
                <XCircle size={16} /> Cancel Order
              </button>
            </>
          )}

          {/* DISTRIBUTOR LOG PAYMENT */}
          {user?.role !== "admin" && !isCancelled && order.status !== "delivered" && (
            <button
              onClick={() => {
                setPaymentForm({ ...paymentForm, amount: paymentStats.balance });
                setShowPaymentModal(true);
              }}
              disabled={paymentStats.balance <= 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold shadow-lg shadow-emerald-200 disabled:opacity-50"
            >
              <CreditCard size={16} /> Log Payment
            </button>
          )}

          {/* ADMIN ACTIONS */}
          {user?.role === "admin" && !isCancelled && !isReturned && (
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN - INFO */}
        <div className="lg:col-span-2 space-y-8">

          {/* ORDER CARD */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order #{order.Orderno}</h1>
                <p className="text-slate-400 text-sm font-bold mt-2">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800">{item.name || item.productId?.name}</p>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-wider mt-1">{item.quantity} units x ₹{item.unitPrice}</p>
                  </div>
                  <span className="font-black text-slate-900">₹{item.totalPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div className="bg-slate-50 rounded-2xl p-6 mt-8 space-y-3">
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>₹{order.pricing.subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>Tax</span>
                <span>₹{order.pricing.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200 mt-4">
                <span>Grand Total</span>
                <span className="text-indigo-600">₹{order.pricing.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <History size={20} className="text-indigo-600" /> Payment History
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining Balance</p>
                <p className={`text-lg font-black ${paymentStats.balance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                  ₹{paymentStats.balance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CreditCard size={32} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-bold text-slate-400 italic">No payments recorded yet.</p>
                </div>
              ) : (
                payments.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <CreditCard size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-800 text-sm">₹{p.amount.toLocaleString()}</p>
                          <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md uppercase">{p.method}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">Ref: {p.transactionId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(p.paidAt).toLocaleDateString()}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase mt-1 inline-block ${p.Paymentstatus === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {p.Paymentstatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DELIVERY DETAILS */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Truck size={20} className="text-indigo-600" /> Delivery Logistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Shipping Address</p>
                <p className="font-bold text-slate-700 leading-relaxed text-sm">{order.delivery.address}</p>
              </div>
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Transporter</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <p className="font-bold text-slate-700 text-sm">{order.delivery.transporterName || "TBD"}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Expected Date</p>
                <p className="font-bold text-slate-700 text-sm">
                  {order.delivery.expectedDate ? new Date(order.delivery.expectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Not scheduled"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - TIMELINE */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-8">
            <h3 className="text-lg font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase tracking-tight">Status Timeline</h3>

            {isCancelled ? (
              <div className="p-6 bg-red-50 text-red-600 rounded-3xl font-black text-center border border-red-100 shadow-sm">
                <XCircle size={32} className="mx-auto mb-3" />
                ORDER CANCELLED
              </div>
            ) : isReturned ? (
              <div className="p-6 bg-amber-50 text-amber-600 rounded-3xl font-black text-center border border-amber-100 shadow-sm">
                <ArrowLeft size={32} className="mx-auto mb-3" />
                ORDER RETURNED
              </div>
            ) : (
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-[3px] bg-slate-100 -z-10 rounded-full"></div>

                {ORDER_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step} className="flex items-center gap-6 group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 ${isCompleted ? "bg-indigo-600 border-indigo-100 shadow-lg shadow-indigo-200" : "bg-white border-slate-100"
                        }`}>
                        {isCompleted && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-[0.15em] transition-colors ${isCompleted ? "text-slate-800" : "text-slate-300"}`}>
                          {step}
                        </p>
                        {isCurrent && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase">Current Stage</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOG PAYMENT MODAL */}
      <CommonModal
        isOpen={showPaymentModal}
        onClose={() => !submittingPayment && setShowPaymentModal(false)}
        title="Log New Payment"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Outstanding Balance</p>
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter">₹{paymentStats.balance.toLocaleString()}</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Payment Amount (₹)</label>
              <input
                type="number"
                required
                max={paymentStats.balance}
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-lg transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Payment Method</label>
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-lg transition-all bg-white"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Wallet">Wallet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Transaction / Ref ID</label>
              <input
                type="text"
                required
                value={paymentForm.transactionId}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-lg transition-all"
                placeholder="e.g. UPI-123456789"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 py-4 px-6 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-100 transition-all border-2 border-transparent"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={submittingPayment}
              className="flex-2 py-4 px-10 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submittingPayment ? "LOGGING..." : <>CONFIRM PAYMENT <ArrowLeft className="rotate-180" size={18} strokeWidth={3} /></>}
            </button>
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    placed: "bg-blue-50 text-blue-600",
    confirmed: "bg-indigo-50 text-indigo-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-600",
    returned: "bg-orange-50 text-orange-600"
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-transparent ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
};

export default OrderDetails;
    


