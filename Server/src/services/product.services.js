import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";


const filterPricingByRole = (product, userRole) => {
    if (!product) return null;

    const productObj = product.toObject ? product.toObject() : product;

    if (userRole === "admin") {
        // Admin sees all pricing
        return productObj;
    } else if (userRole === "distributor") {
        // Distributor only sees their price
        return {
            ...productObj,
            pricing: {
                distributor: productObj.pricing?.distributor
            }
        };
    } else if (userRole === "sub_distributor" || userRole === "retailer") {
        // Sub-distributor/retailer only sees their price
        return {
            ...productObj,
            pricing: {
                sub_distributor: productObj.pricing?.sub_distributor
            }
        };
    }

    // Default: no pricing info for unknown roles
    return {
        ...productObj,
        pricing: {}
    };
};

/**
 * Get price value based on user role
 * @param {Object} pricing - Pricing object
 * @param {String} userRole - User role
 * @returns {Number} - Price for the role
 */
const getPriceByRole = (pricing, userRole) => {
    if (userRole === "admin") {
        return pricing?.admin?.mrp || 0;
    } else if (userRole === "distributor") {
        return pricing?.distributor?.price || 0;
    } else if (userRole === "sub_distributor" || userRole === "retailer") {
        return pricing?.sub_distributor?.price || 0;
    }
    return 0;
};

// ============================================================================
// CRUD OPERATIONS
// ============================================================================


// Create a new product

const CreateProductService = async (productData, userId) => {
    const { name, pricing, taxpercentage, stock, minStockAlert, unit, quantity, totalPrice } = productData;

    // Validation
    if (!name || !stock || !unit || !quantity || !totalPrice) {
        throw new ApiError(400, "Name, stock, unit, quantity, and totalPrice are required");
    }

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
        throw new ApiError(400, "Product with this name already exists");
    }

    // Create product with createdBy field
    const product = await Product.create({
        name: name.trim(),
        pricing,
        taxpercentage: taxpercentage || 5,
        stock,
        minStockAlert: minStockAlert || 10,
        unit,
        quantity,
        totalPrice,
        createdBy: userId,
        updatedBy: userId
    });

    return product;
};

/**
 * Get product by ID with role-based pricing
 */
const GetProductByIdService = async (productId, userRole) => {
    const product = await Product.findById(productId)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return filterPricingByRole(product, userRole);
};

/**
 * Update product by ID
 */
const UpdateProductService = async (productId, updateData, userId, userRole) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Ownership check: Distributor can only update their own products
    if (userRole === "distributor" && product.createdBy.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden: You can only update your own products");
    }

    // Add updatedBy
    updateData.updatedBy = userId;

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    return updatedProduct;
};

/**
 * Delete product by ID
 */
const DeleteProductService = async (productId, userId, userRole) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Ownership check: Distributor can only delete their own products
    if (userRole === "distributor" && product.createdBy.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden: You can only delete your own products");
    }

    await Product.findByIdAndDelete(productId);
    return { id: productId };
};

// ============================================================================
// ADVANCED QUERY OPERATIONS
// ============================================================================

/**
 * Get all products with filtering, pagination, and sorting
 */
const GetAllProductsService = async (queryParams, userRole) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        search = "",
        minPrice,
        maxPrice,
        unit,
        minStock,
        maxStock,
        taxpercentage
    } = queryParams;

    // Build query
    const query = { parentProductId: null };

    // Search by name
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    // Filter by unit
    if (unit) {
        query.unit = unit;
    }

    // Filter by stock range
    if (minStock !== undefined) {
        query.stock = { ...query.stock, $gte: Number(minStock) };
    }
    if (maxStock !== undefined) {
        query.stock = { ...query.stock, $lte: Number(maxStock) };
    }

    // Filter by tax percentage
    if (taxpercentage !== undefined) {
        query.taxpercentage = Number(taxpercentage);
    }

    // Price filtering based on role
    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceQuery = {};
        if (minPrice !== undefined) priceQuery.$gte = Number(minPrice);
        if (maxPrice !== undefined) priceQuery.$lte = Number(maxPrice);

        if (userRole === "admin") {
            query["pricing.admin.mrp"] = priceQuery;
        } else if (userRole === "distributor") {
            query["pricing.distributor.price"] = priceQuery;
        } else if (userRole === "sub_distributor" || userRole === "retailer") {
            query["pricing.sub_distributor.price"] = priceQuery;
        }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    const totalProducts = await Product.countDocuments(query);

    // Filter pricing by role
    const filteredProducts = products.map(product =>
        filterPricingByRole(product, userRole)
    );

    return {
        products: filteredProducts,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / Number(limit)),
            totalProducts,
            hasMore: skip + products.length < totalProducts
        }
    };
};

/**
 * Search products by name
 */
const SearchProductsService = async (searchTerm, userRole) => {
    if (!searchTerm || searchTerm.trim() === "") {
        throw new ApiError(400, "Search term is required");
    }

    const products = await Product.find({
        name: { $regex: searchTerm, $options: "i" }
    })
        .limit(20)
        .populate("createdBy", "name email");

    const filteredProducts = products.map(product =>
        filterPricingByRole(product, userRole)
    );

    return filteredProducts;
};

/**
 * Filter products by price range based on role
 */
const FilterProductsByPriceRangeService = async (minPrice, maxPrice, userRole) => {
    const query = {};

    const priceQuery = {};
    if (minPrice !== undefined) priceQuery.$gte = Number(minPrice);
    if (maxPrice !== undefined) priceQuery.$lte = Number(maxPrice);

    if (userRole === "admin") {
        query["pricing.admin.mrp"] = priceQuery;
    } else if (userRole === "distributor") {
        query["pricing.distributor.price"] = priceQuery;
    } else if (userRole === "sub_distributor" || userRole === "retailer") {
        query["pricing.sub_distributor.price"] = priceQuery;
    }

    const products = await Product.find(query).populate("createdBy", "name email");

    const filteredProducts = products.map(product =>
        filterPricingByRole(product, userRole)
    );

    return filteredProducts;
};

/**
 * Get products with low stock (below minStockAlert)
 */
const GetLowStockProductsService = async () => {
    const products = await Product.find({
        $expr: { $lte: ["$stock", "$minStockAlert"] }
    })
        .sort({ stock: 1 })
        .populate("createdBy", "name email");

    return products;
};

// ============================================================================
// STOCK MANAGEMENT
// ============================================================================

/**
 * Update stock for a product
 */
const UpdateStockService = async (productId, quantity, operation = "set", userId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let newStock;

    if (operation === "add") {
        newStock = product.stock + Number(quantity);
    } else if (operation === "subtract") {
        newStock = product.stock - Number(quantity);
        if (newStock < 0) {
            throw new ApiError(400, "Insufficient stock. Cannot reduce below zero.");
        }
    } else {
        // Default: set operation
        newStock = Number(quantity);
        if (newStock < 0) {
            throw new ApiError(400, "Stock cannot be negative");
        }
    }

    product.stock = newStock;
    product.updatedBy = userId;
    await product.save();

    return product;
};

/**
 * Bulk update stock for multiple products
 */
const BulkUpdateStockService = async (stockUpdates, userId) => {
    // stockUpdates format: [{ productId, quantity, operation }]

    if (!Array.isArray(stockUpdates) || stockUpdates.length === 0) {
        throw new ApiError(400, "Stock updates array is required");
    }

    const results = [];
    const errors = [];

    for (const update of stockUpdates) {
        try {
            const updatedProduct = await UpdateStockService(
                update.productId,
                update.quantity,
                update.operation || "set",
                userId
            );
            results.push({
                productId: update.productId,
                success: true,
                newStock: updatedProduct.stock
            });
        } catch (error) {
            errors.push({
                productId: update.productId,
                success: false,
                error: error.message
            });
        }
    }

    return { results, errors };
};

/**
 * Check stock availability
 */
const CheckStockAvailabilityService = async (productId, requiredQuantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const isAvailable = product.stock >= Number(requiredQuantity);

    return {
        productId,
        productName: product.name,
        currentStock: product.stock,
        requiredQuantity: Number(requiredQuantity),
        isAvailable,
        remainingStock: isAvailable ? product.stock - Number(requiredQuantity) : 0
    };
};

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Get product statistics
 */
const GetProductStatsService = async (userRole) => {
    const totalProducts = await Product.countDocuments();

    const lowStockProducts = await Product.countDocuments({
        $expr: { $lte: ["$stock", "$minStockAlert"] }
    });

    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Calculate total inventory value based on role
    const allProducts = await Product.find();
    let totalInventoryValue = 0;

    allProducts.forEach(product => {
        const price = getPriceByRole(product.pricing, userRole);
        totalInventoryValue += price * product.stock;
    });

    // Get total stock
    const stockAggregation = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalStock: { $sum: "$stock" }
            }
        }
    ]);

    const totalStock = stockAggregation.length > 0 ? stockAggregation[0].totalStock : 0;

    return {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStock,
        totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
        currency: "INR"
    };
};

/**
 * Get products created by specific user
 */
const GetProductsByUserService = async (userId, userRole) => {
    const products = await Product.find({ createdBy: userId })
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    const filteredProducts = products.map(product =>
        filterPricingByRole(product, userRole)
    );

    return filteredProducts;
};

/**
 * Get total inventory value
 */
const GetTotalInventoryValueService = async (userRole) => {
    const products = await Product.find();

    let totalValue = 0;
    const breakdown = [];

    products.forEach(product => {
        const price = getPriceByRole(product.pricing, userRole);
        const productValue = price * product.stock;
        totalValue += productValue;

        breakdown.push({
            productId: product._id,
            productName: product.name,
            stock: product.stock,
            unitPrice: price,
            totalValue: parseFloat(productValue.toFixed(2))
        });
    });

    return {
        totalInventoryValue: parseFloat(totalValue.toFixed(2)),
        currency: "INR",
        breakdown: breakdown.sort((a, b) => b.totalValue - a.totalValue)
    };
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk create products
 */
const BulkCreateProductsService = async (productsData, userId) => {
    if (!Array.isArray(productsData) || productsData.length === 0) {
        throw new ApiError(400, "Products array is required");
    }

    // Add createdBy and updatedBy to all products
    const productsWithUser = productsData.map(product => ({
        ...product,
        name: product.name?.trim(),
        createdBy: userId,
        updatedBy: userId
    }));

    try {
        const products = await Product.insertMany(productsWithUser, {
            ordered: false // Continue even if some fail
        });
        return products;
    } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
            throw new ApiError(400, "Some products already exist with duplicate names");
        }
        throw new ApiError(500, error.message);
    }
};

/**
 * Bulk update products
 */
const BulkUpdateProductsService = async (updates, userId) => {
    // updates format: [{ productId, updateData }]

    if (!Array.isArray(updates) || updates.length === 0) {
        throw new ApiError(400, "Updates array is required");
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
        try {
            const updatedProduct = await UpdateProductService(
                update.productId,
                update.updateData,
                userId
            );
            results.push({
                productId: update.productId,
                success: true,
                product: updatedProduct
            });
        } catch (error) {
            errors.push({
                productId: update.productId,
                success: false,
                error: error.message
            });
        }
    }

    return { results, errors };
};

/**
 * Bulk delete products
 */
const BulkDeleteProductsService = async (productIds) => {
    if (!Array.isArray(productIds) || productIds.length === 0) {
        throw new ApiError(400, "Product IDs array is required");
    }

    const result = await Product.deleteMany({
        _id: { $in: productIds }
    });

    return {
        deletedCount: result.deletedCount,
        requestedCount: productIds.length
    };
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
    CreateProductService,
    GetProductByIdService,
    UpdateProductService,
    DeleteProductService,
    GetAllProductsService,
    SearchProductsService,
    FilterProductsByPriceRangeService,
    GetLowStockProductsService,
    UpdateStockService,
    BulkUpdateStockService,
    CheckStockAvailabilityService,
    GetProductStatsService,
    GetProductsByUserService,
    GetTotalInventoryValueService,
    BulkCreateProductsService,
    BulkUpdateProductsService,
    BulkDeleteProductsService
};
