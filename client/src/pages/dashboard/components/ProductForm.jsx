import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: "",
        unit: "kg",
        quantity: "",
        stock: "",
        minStockAlert: "10",
        taxpercentage: "5",
        totalPrice: "", // Base Cost
        pricing: {
            admin: { mrp: "" },
            distributor: { price: "" },
            sub_distributor: { price: "" },
        },
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                unit: initialData.unit || "kg",
                quantity: initialData.quantity || "",
                stock: initialData.stock || "",
                minStockAlert: initialData.minStockAlert || "10",
                taxpercentage: initialData.taxpercentage || "5",
                totalPrice: initialData.totalPrice || "",
                pricing: {
                    admin: { mrp: initialData.pricing?.admin?.mrp || "" },
                    distributor: { price: initialData.pricing?.distributor?.price || "" },
                    sub_distributor: {
                        price: initialData.pricing?.sub_distributor?.price || "",
                    },
                },
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePricingChange = (role, field, value) => {
        setFormData((prev) => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [role]: { ...prev.pricing[role], [field]: value },
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic Validation
        if (!formData.name || !formData.stock || !formData.quantity || !formData.totalPrice) {
            toast.error("Please fill in all required fields");
            return;
        }
        onSubmit(formData);
    };

    const inputClass =
        "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400";
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
    const sectionTitleClass = "text-sm font-black text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- BASIC DETAILS --- */}
            <div>
                <h3 className={sectionTitleClass}>Basic Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Premium Biryani Masala"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Unit *</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="l">l</option>
                            <option value="ml">ml</option>
                            <option value="pcs">pcs</option>
                            <option value="box">box</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Quantity (Value per Unit) *</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="e.g. 500 (for 500g)"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Tax Percentage (%)</label>
                        <input
                            type="number"
                            name="taxpercentage"
                            value={formData.taxpercentage}
                            onChange={handleChange}
                            placeholder="5"
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* --- STOCK & INVENTORY --- */}
            <div>
                <h3 className={sectionTitleClass}>Inventory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Initial Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="0"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Min Stock Alert</label>
                        <input
                            type="number"
                            name="minStockAlert"
                            value={formData.minStockAlert}
                            onChange={handleChange}
                            placeholder="10"
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* --- PRICING --- */}
            <div>
                <h3 className={sectionTitleClass}>Pricing & Costs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Base Cost (Total Price) *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={`${inputClass} pl-8`}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>MRP (Admin) *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                value={formData.pricing.admin.mrp}
                                onChange={(e) => handlePricingChange("admin", "mrp", e.target.value)}
                                placeholder="0.00"
                                className={`${inputClass} pl-8`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Distributor Price</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                value={formData.pricing.distributor.price}
                                onChange={(e) => handlePricingChange("distributor", "price", e.target.value)}
                                placeholder="0.00"
                                className={`${inputClass} pl-8`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Retailer Price</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                value={formData.pricing.sub_distributor.price}
                                onChange={(e) => handlePricingChange("sub_distributor", "price", e.target.value)}
                                placeholder="0.00"
                                className={`${inputClass} pl-8`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Save Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
