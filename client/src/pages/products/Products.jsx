import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProducts, deleteProduct } from "../../api/admin/product.api";
import { toast } from "react-toastify";
import ProductModal from "../dashboard/components/ProductModal";
import { Edit, Trash2 } from "lucide-react";

const Products = () => {
  const { user } = useAuth();
  const isDistributor = user?.role === "distributor";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,

      };

      // If stock filter is applied
      if (stockFilter === "low_stock") {

      }

      const data = await getProducts(params);
      setProducts(data?.data?.products || []);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]); // Re-fetch when search changes

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleSuccess = () => {
    fetchProducts();
  };

  // Helper for dynamic status badge colors
  const getStatusClasses = (status) => {
    return status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Product Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your masala products and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64"
            />
            {/* Search Icon could go here */}
          </div>

          {!isDistributor && (
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center shadow-lg shadow-indigo-200 transition-all active:scale-95 whitespace-nowrap"
            >
              <span className="text-lg mr-2 leading-none">+</span> Add Product
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  {!isDistributor && (
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">No products found.</td>
                  </tr>
                ) : products.map((p) => (
                  <tr
                    key={p._id || p.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-100 transition-colors">
                          {p.name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium border border-slate-200">
                        {p.quantity ? `${p.quantity} ` : ""}{p.unit || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{(() => {
                        const pricing = p.pricing || {};
                        if (user?.role === "admin") return pricing.admin?.mrp || 0;
                        if (user?.role === "distributor") return pricing.distributor?.price || 0;
                        if (user?.role === "sub_distributor") return pricing.sub_distributor?.price || 0;
                        return p.price || 0;
                      })()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {p.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px - 3 py - 1 rounded - full text - xs font - bold border ${getStatusClasses(p.stock > 0 ? "Active" : "Inactive")} `}
                      >
                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    {!isDistributor && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id || p.id)}
                            className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Products;
