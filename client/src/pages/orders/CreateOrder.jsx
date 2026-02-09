import { useState } from "react";

const CreateOrder = () => {
  const products = [
    { id: 1, name: "Biryani Masala", price: 120 },
    { id: 2, name: "Chicken Masala", price: 80 },
    { id: 3, name: "Garam Masala", price: 150 },
  ];

  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);

  const selectedProduct = products.find((p) => p.id === Number(productId));
  const total = selectedProduct ? selectedProduct.price * qty : 0;

  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create New Order</h1>
        <p className="text-slate-500">
          Fill in the details below to place a new order.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        {/* Product Selection */}
        <div className="flex flex-col mb-5">
          <label className="text-sm font-semibold text-slate-700 mb-2">
            Select Product
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="p-3 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
          >
            <option value="">Choose a masala...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} – ₹{p.price}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div className="flex flex-col mb-6">
          <label className="text-sm font-semibold text-slate-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="p-3 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
          />
        </div>

        {/* Order Summary Card */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex justify-between items-center">
          <span className="text-indigo-900 font-medium">Order Total:</span>
          <strong className="text-2xl text-indigo-700 font-bold">
            ₹{total}
          </strong>
        </div>

        {/* Submit Button */}
        <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
          Place Order
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          Prices are inclusive of all taxes
        </p>
      </div>
    </div>
  );
};

export default CreateOrder;
