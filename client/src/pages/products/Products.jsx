import React from "react";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Biryani Masala",
      weight: "100g",
      price: "₹120",
      status: "Active",
    },
    {
      id: 2,
      name: "Chicken Masala",
      weight: "50g",
      price: "₹70",
      status: "Active",
    },
    {
      id: 3,
      name: "Garam Masala",
      weight: "100g",
      price: "₹150",
      status: "Inactive",
    },
  ];

  // Helper for dynamic status badge colors
  const getStatusClasses = (status) => {
    return status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header with Action Button */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Product Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your masala products and pricing.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <span className="text-lg mr-2 leading-none">+</span> Add Product
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Weight
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-100 transition-colors">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium border border-slate-200">
                      {p.weight}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {p.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusClasses(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
