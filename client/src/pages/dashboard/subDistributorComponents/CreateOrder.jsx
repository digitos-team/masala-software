import { useState } from "react";
import { ShoppingCart, Package, Hash, Send } from "lucide-react"; // Agar lucide-react use kar raha hai toh, varna simple icons bhi chalenge

const CreateOrder = () => {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Sent:", form);
    alert("Order sent for approval!");
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
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none text-slate-700 cursor-pointer"
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              value={form.product}
            >
              <option value="" disabled hidden>
                Choose a masala...
              </option>
              <option>Biryani Masala</option>
              <option>Chicken Masala</option>
              <option>Garam Masala</option>
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
              placeholder="Enter quantity (e.g. 50)"
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              value={form.quantity}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
        >
          <Send size={18} />
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
