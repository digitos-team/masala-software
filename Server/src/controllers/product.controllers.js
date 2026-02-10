import {
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
} from "../services/product.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ============================================================================
// CRUD CONTROLLERS
// ============================================================================

/**
 * Create a new product
 * @route POST /api/products
 * @access Admin only
 */
const createProduct = asyncHandler(async (req, res) => {
    const product = await CreateProductService(req.body, req.user._id);

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

/**
 * Get single product by ID
 * @route GET /api/products/:id
 * @access Authenticated users
 */
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    const product = await GetProductByIdService(id, userRole);

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});

/**
 * Get all products with filters, pagination, and sorting
 * @route GET /api/products
 * @access Authenticated users
 */
const getAllProducts = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const result = await GetAllProductsService(req.query, userRole);

    return res.status(200).json(
        new ApiResponse(200, result, "Products retrieved successfully")
    );
});

/**
 * Update product by ID
 * @route PUT /api/products/:id
 * @access Admin only
 */
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await UpdateProductService(id, req.body, req.user._id, req.user.role);

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    );
});

/**
 * Delete product by ID
 * @route DELETE /api/products/:id
 * @access Admin only
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await DeleteProductService(id, req.user._id, req.user.role);

    return res.status(200).json(
        new ApiResponse(200, result, "Product deleted successfully")
    );
});

// ============================================================================
// SEARCH & FILTER CONTROLLERS
// ============================================================================

/**
 * Search products by name
 * @route POST /api/products/search
 * @access Authenticated users
 */
const searchProducts = asyncHandler(async (req, res) => {
    const { searchTerm, name, q } = req.query;
    const userRole = req.user.role;

    const term = name || q || searchTerm;

    const products = await SearchProductsService(term, userRole);

    return res.status(200).json(
        new ApiResponse(200, products, "Search completed successfully")
    );
});

/**
 * Filter products by price range
 * @route GET /api/products/filter/price
 * @access Authenticated users
 */
const filterProductsByPrice = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    const userRole = req.user.role;

    const products = await FilterProductsByPriceRangeService(
        minPrice,
        maxPrice,
        userRole
    );

    return res.status(200).json(
        new ApiResponse(200, products, "Products filtered successfully")
    );
});

// ============================================================================
// STOCK MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * Update product stock
 * @route PATCH /api/products/:id/stock
 * @access Admin only
 */
const updateStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    if (quantity === undefined) {
        return res.status(400).json(
            new ApiResponse(400, null, "Quantity is required")
        );
    }

    const product = await UpdateStockService(
        id,
        quantity,
        operation || "set",
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(200, product, "Stock updated successfully")
    );
});

/**
 * Get low stock products
 * @route GET /api/products/low-stock
 * @access Admin only
 */
const getLowStockProducts = asyncHandler(async (req, res) => {
    const products = await GetLowStockProductsService();

    return res.status(200).json(
        new ApiResponse(
            200,
            products,
            `Found ${products.length} products with low stock`
        )
    );
});

/**
 * Check stock availability
 * @route GET /api/products/check-stock/:id
 * @access Authenticated users
 */
const checkStockAvailability = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.query;

    if (!quantity) {
        return res.status(400).json(
            new ApiResponse(400, null, "Quantity is required")
        );
    }

    const result = await CheckStockAvailabilityService(id, quantity);

    return res.status(200).json(
        new ApiResponse(200, result, "Stock availability checked")
    );
});

/**
 * Bulk update stock
 * @route PUT /api/products/bulk/stock
 * @access Admin only
 */
const bulkUpdateStock = asyncHandler(async (req, res) => {
    console.log("Bulk Stock Update Body:", JSON.stringify(req.body, null, 2));
    console.log("Content-Type:", req.headers["content-type"]);

    let { stockUpdates } = req.body || {};

    // Support sending array directly in body
    if (!stockUpdates && Array.isArray(req.body)) {
        stockUpdates = req.body;
    }

    if (!stockUpdates || !Array.isArray(stockUpdates) || stockUpdates.length === 0) {
        return res.status(400).json(
            new ApiResponse(400, { receivedBody: req.body, contentType: req.headers["content-type"] }, "Stock updates array is required. Ensure you are sending JSON with correct headers.")
        );
    }

    const result = await BulkUpdateStockService(stockUpdates, req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully updated ${result.results.length} products`
        )
    );
});

// ============================================================================
// ANALYTICS CONTROLLERS
// ============================================================================

/**
 * Get product statistics
 * @route GET /api/products/stats
 * @access Admin only
 */
const getProductStats = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const stats = await GetProductStatsService(userRole);

    return res.status(200).json(
        new ApiResponse(200, stats, "Statistics retrieved successfully")
    );
});

/**
 * Get products by user
 * @route GET /api/products/user/:userId
 * @access Admin only
 */
const getProductsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userRole = req.user.role;

    const products = await GetProductsByUserService(userId, userRole);

    return res.status(200).json(
        new ApiResponse(200, products, "User products retrieved successfully")
    );
});

/**
 * Get total inventory value
 * @route GET /api/products/inventory/value
 * @access Admin only
 */
const getInventoryValue = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const result = await GetTotalInventoryValueService(userRole);

    return res.status(200).json(
        new ApiResponse(200, result, "Inventory value calculated successfully")
    );
});

// ============================================================================
// BULK OPERATION CONTROLLERS
// ============================================================================

/**
 * Bulk create products
 * @route POST /api/products/bulk
 * @access Admin only
 */
const bulkCreateProducts = asyncHandler(async (req, res) => {
    const { products } = req.body || {};

    const createdProducts = await BulkCreateProductsService(
        products,
        req.user._id
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            createdProducts,
            `Successfully created ${createdProducts.length} products`
        )
    );
});

/**
 * Bulk update products
 * @route PUT /api/products/bulk
 * @access Admin only
 */
const bulkUpdateProducts = asyncHandler(async (req, res) => {
    const { updates } = req.body || {};

    const result = await BulkUpdateProductsService(updates, req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully updated ${result.results.length} products`
        )
    );
});

/**
 * Bulk delete products
 * @route DELETE /api/products/bulk
 * @access Admin only
 */
const bulkDeleteProducts = asyncHandler(async (req, res) => {
    const { productIds } = req.body || {};

    const result = await BulkDeleteProductsService(productIds);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully deleted ${result.deletedCount} out of ${result.requestedCount} products`
        )
    );
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProductsByPrice,
    updateStock,
    getLowStockProducts,
    checkStockAvailability,
    bulkUpdateStock,
    getProductStats,
    getProductsByUser,
    getInventoryValue,
    bulkCreateProducts,
    bulkUpdateProducts,
    bulkDeleteProducts
};
