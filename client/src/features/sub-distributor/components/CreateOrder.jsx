import { useState } from "react";
import { ShoppingCart, Package, Hash, Send, Loader2 } from "lucide-react";
import { useSubDistributorData } from "../hooks/useSubDistributorData";
import subDistributorApi from "../api/subDistributorApi";

const CreateOrder = () => {
  const { products, loading: productsLoading, refetchOrders } = useSubDistributorData();
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    deliveryAddress: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity) {
      alert("Please select a product and enter quantity");
      return;
    }

    try {
      setSubmitting(true);

      // Create order with the selected product
      await subDistributorApi.createOrder({
        products: [
          {
            productId: form.productId,
            quantity: parseInt(form.quantity),
          },
        ],
        deliveryAddress: form.deliveryAddress || "To be confirmed",
      });

      alert("Order created successfully!");

      // Reset form
      setForm({
        productId: "",
        quantity: "",
        deliveryAddress: "",
      });

      // Refresh orders list
      if (refetchOrders) {
        await refetchOrders();
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      alert(error.response?.data?.message || "Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 w-full transition-all hover:shadow-md">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-50 p-2.5 rounded-xl">
          <ShoppingCart className="text-indigo-600 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Create New Order</h3>
          <p className="text-sm text-slate-500 font-medium">
            Place your stock requirements
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Select Product
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Package size={18} />
            </div>
            <select
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              value={form.productId}
              disabled={productsLoading || submitting}
            >
              <option value="" disabled hidden>
                {productsLoading ? "Loading products..." : "Choose a product..."}
              </option>
              {products?.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (₹{product.pricing?.sellingPrice || product.pricing?.mrp || "N/A"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Quantity
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Hash size={18} />
            </div>
            <input
              type="number"
              min="1"
              placeholder="Enter quantity (e.g. 50)"
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              value={form.quantity}
              disabled={submitting}
            />
          </div>
        </div>

        {/* Delivery Address (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Delivery Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            placeholder="Enter delivery address..."
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows="2"
            onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
            value={form.deliveryAddress}
            disabled={submitting}
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={submitting || productsLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating Order...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Order
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
