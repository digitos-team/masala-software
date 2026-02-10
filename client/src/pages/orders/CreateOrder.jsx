import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Minus, Trash2, ShoppingCart, Package, ArrowRight, Truck } from "lucide-react";
import { getProducts, getProductsByUser } from "../../api/admin/product.api";
import { createOrder, updateOrder, getOrder } from "../../api/admin/order.api";
import { useAuth } from "../../context/AuthContext";
import { getDistributors } from "../../api/auth/auth.api";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  // Data State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  // Cart State
  const [cart, setCart] = useState([]);

  // Form State
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    transporterName: "",
    expectedDate: "",
  });

  // Distributor Selection State (for Retailers)
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null); // null = Admin

  // Fetch Initial Data (Products and Order if editing)
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // 1. Fetch Distributors if Retailer
        if (user?.role === "retailer") {
          const distRes = await getDistributors();
          setDistributors(distRes.data || []);
        }

        // 2. Fetch Initial Products
        // Distributors and retailers see all products (to order from admin)
        const productRes = await getProducts();
        const fetchedProducts = productRes.data?.products || productRes.data || [];
        setProducts(fetchedProducts);

        // 3. Fetch Order if Editing
        if (isEditMode) {
          setOrderLoading(true);
          const orderRes = await getOrder(id);
          const orderData = orderRes.data;

          if (orderData.status !== "placed") {
            toast.error("Only 'Placed' orders can be edited.");
            return navigate("/orders");
          }

          // Pre-fill Cart
          // We need to map order products back to cart format
          // Order products have schema: { productId: Object, name, quantity, unitPrice, ... }
          const initialCart = orderData.products.map(item => ({
            productId: item.productId._id || item.productId, // Handle populated or not
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            taxPercentage: item.taxPercentage,
            taxAmount: item.taxAmount,
            stock: fetchedProducts.find(p => p._id === (item.productId._id || item.productId))?.stock || 0 // Warning: Stock might form backend might be current stock, not including what's in this order? 
            // Actually, backend deleted stock when order placed. So available stock is Product.stock. 
            // If we edit, we might be increasing/decreasing.
            // Ideally backend handles this complexity. For now, we just display current available stock from products list.
          }));
          setCart(initialCart);

          // Pre-fill Delivery
          setDeliveryDetails({
            address: orderData.delivery.address || "",
            transporterName: orderData.delivery.transporterName || "",
            expectedDate: orderData.delivery.expectedDate ? new Date(orderData.delivery.expectedDate).toISOString().split('T')[0] : "",
          });
        }
      } catch (error) {
        console.error("Initialization failed", error);
        toast.error("Failed to load data");
        if (isEditMode) navigate("/orders");
      } finally {
        setLoading(false);
        setOrderLoading(false);
      }
    };

    init();
  }, [id, isEditMode, navigate, user?.role]);

  // Refetch Products when Distributor changes (for Retailers)
  useEffect(() => {
    if (isEditMode) return; // Don't refetch products if editing an existing order
    if (user?.role !== "retailer") return;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let productRes;
        if (selectedDistributor) {
          productRes = await getProductsByUser(selectedDistributor);
        } else {
          productRes = await getProducts();
        }
        const fetchedProducts = productRes.data?.products || productRes.data || [];
        setProducts(fetchedProducts);
        setCart([]); // Clear cart when supplier changes to avoid mixed or invalid products
      } catch (error) {
        console.error("Failed to fetch filtered products", error);
        toast.error("Failed to load products for selected supplier");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedDistributor, user?.role, isEditMode]);

  // Helper: Get Price based on Role
  const getPrice = (product) => {
    if (!product.pricing) return 0;

    if (user?.role === "distributor") {
      return Number(product.pricing.distributor?.price) || Number(product.pricing.admin?.mrp) || 0;
    } else if (user?.role === "sub_distributor" || user?.role === "retailer") {
      return Number(product.pricing.sub_distributor?.price) || Number(product.pricing.admin?.mrp) || 0;
    }

    // Default for Admin or unknown roles
    return Number(product.pricing.admin?.mrp) || 0;
  };

  // Add Item to Cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.warning(`Only ${product.stock} units available!`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        );
      } else {
        const price = getPrice(product);
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            unitPrice: price,
            quantity: 1,
            totalPrice: price,
            // Basic tax calculation (can be refined based on backend logic)
            taxPercentage: product.tax || 5,
            taxAmount: (price * (product.tax || 5)) / 100,
            stock: product.stock
          },
        ];
      }
    });
  };

  // Update Cart Quantity
  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          // Note: Ideally we check against (stock + original_qty_in_order) if editing, but for simplicity we check against current stock
          if (newQty > item.stock + 1000) { // Removed strict stock check for now to allow editing if logic is complex
            // Ideally: if editing, we shouldn't block based on Product.stock alone because we are holding some stock?
            // Actually, Product.stock is what is remaining in warehouse. 
            // If I have 10 in my order, and stock is 0. I should be able to keep 10.
            // But if I want 11, I can't.
            // This simple UI check might block me if stock is 0. 
            // Refinement: skip strict check here for simplicity or assume stock is sufficient for updates.
            // Restoring check:
          }
          if (newQty > item.stock && !isEditMode) { // Only enforce strict stock on NEW orders?
            toast.warning(`Limited stock available.`);
            // return item; // Let them try? Backend will validate.
          }
          return {
            ...item,
            quantity: newQty,
            totalPrice: newQty * item.unitPrice,
            taxAmount: (newQty * item.unitPrice * item.taxPercentage) / 100
          };
        }
        return item;
      })
    );
  };

  // Remove Item
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Calculate Totals
  const totals = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const taxAmount = cart.reduce((acc, item) => acc + item.taxAmount, 0);
    const shippingCharge = 0; // Removed example logic (was 150)
    const grandTotal = subTotal + taxAmount + shippingCharge;
    return { subTotal, taxAmount, shippingCharge, grandTotal };
  }, [cart]);

  // Submit Order
  const handleSubmit = async () => {
    if (cart.length === 0) {
      return toast.error("Cart is empty!");
    }
    if (!deliveryDetails.address) {
      return toast.error("Delivery address is required!");
    }

    const orderPayload = {
      products: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        name: item.name,
        taxPercentage: item.taxPercentage,
        totalPrice: item.totalPrice,
        taxAmount: item.taxAmount
      })),
      pricing: totals,
      delivery: {
        ...deliveryDetails,
        deliveredAt: null,
        trackingNumber: ""
      },
      distributorId: user?.role === "distributor" ? user._id : selectedDistributor,
      subDistributorId: user?.role === "retailer" ? user._id : null,
      // status: "placed" // Don't reset status on edit? Or do? Backend handles it.
    };

    if (!isEditMode) {
      orderPayload.invoiceNumber = `INV-${Date.now()}`;
      orderPayload.status = "placed";
    }

    try {
      if (isEditMode) {
        await updateOrder(id, orderPayload);
        toast.success("Order updated successfully!");
      } else {
        await createOrder(orderPayload);
        toast.success("Order placed successfully!");
      }
      navigate("/orders");
    } catch (error) {
      console.error("Order failed:", error);
      toast.error(error.response?.data?.message || "Failed to process order");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* PRODUCT LIST SECTION */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {isEditMode ? "Edit Order" : "Create Order"}
          </h1>
          <p className="text-slate-500 font-medium">Select products relative to your plan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.weight} {product.unit}</span>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black rounded-lg text-sm">
                  ₹{getPrice(product)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400">
                  Stock: <span className={product.stock < 10 ? "text-red-500" : "text-emerald-500"}>{product.stock}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  // disabled={product.stock <= 0} // Allow adding if stock is 0 but we want to backorder? Or just block.
                  disabled={product.stock <= 0}
                  className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CART & CHECKOUT SECTION */}
      <div className="w-full lg:w-[400px] xl:w-[450px]">
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-8">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-600" /> Current Order
            </h2>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">{cart.length} Items</span>
          </div>

          <div className="p-6 max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Package size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold">Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 group">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-500">₹{item.unitPrice} x {item.quantity}</span>
                      <span className="font-bold text-indigo-600">= ₹{item.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"><Minus size={14} /></button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"><Plus size={14} /></button>
                  </div>

                  <button onClick={() => removeFromCart(item.productId)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* CHECKOUT DETAILS */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
            {/* Supplier Selection (Only for Retailers and Not in Edit Mode) */}
            {user?.role === "retailer" && !isEditMode && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Order From</label>
                <select
                  value={selectedDistributor || ""}
                  onChange={(e) => setSelectedDistributor(e.target.value || null)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Company (Admin)</option>
                  {distributors.map((dist) => (
                    <option key={dist._id} value={dist._id}>
                      {dist.name} (Distributor)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Changing supplier will clear your current cart.</p>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Delivery Address</label>
              <textarea
                rows="2"
                value={deliveryDetails.address}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Enter full shipping address..."
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Expected Date</label>
                <input
                  type="date"
                  value={deliveryDetails.expectedDate}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, expectedDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Transporter</label>
                <input
                  type="text"
                  value={deliveryDetails.transporterName}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, transporterName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="py-4 border-t border-dashed border-slate-300 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Subtotal</span>
                <span>₹{totals.subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Tax (Est.)</span>
                <span>₹{totals.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-800 pt-2">
                <span>Grand Total</span>
                <span>₹{totals.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={cart.length === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isEditMode ? "Update Order" : "Confirm Order"}</span>
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

    </div >
  );
};

export default CreateOrder;
