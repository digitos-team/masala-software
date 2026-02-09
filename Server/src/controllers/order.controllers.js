import {
    CreateOrderService,
    GetOrderByIdService,
    UpdateOrderService,
    DeleteOrderService,
    GetAllOrdersService,
    UpdateOrderStatusService,
    GetOrderStatsService,
    GetOrdersByUserService,
    GetRevenueReportService,
    GetTopSellingProductsService,
    BulkUpdateOrderStatusService,
    BulkCancelOrdersService
} from "../services/order.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ============================================================================
// CRUD CONTROLLERS
// ============================================================================

/**
 * Create a new order
 * @route POST /api/orders
 * @access Authenticated users
 */
const createOrder = asyncHandler(async (req, res) => {
    const order = await CreateOrderService(req.body, req.user._id, req.user.role);

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});


/**
 * Get single order by ID
 * @route GET /api/orders/:id
 * @access Authenticated users (own orders) / Admin (all orders)
 */
const getOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user._id;

    const order = await GetOrderByIdService(id, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, order, "Order retrieved successfully")
    );
});

/**
 * Get all orders with filters, pagination, and sorting
 * @route GET /api/orders
 * @access Authenticated users
 */
const getAllOrders = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user._id;

    const result = await GetAllOrdersService(req.query, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, result, "Orders retrieved successfully")
    );
});

/**
 * Update order by ID
 * @route PUT /api/orders/:id
 * @access Admin only
 */
const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    const order = await UpdateOrderService(id, req.body, userRole);

    return res.status(200).json(
        new ApiResponse(200, order, "Order updated successfully")
    );
});

/**
 * Delete order by ID
 * @route DELETE /api/orders/:id
 * @access Admin only
 */
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await DeleteOrderService(id);

    return res.status(200).json(
        new ApiResponse(200, result, "Order deleted successfully")
    );
});



// ============================================================================
// ORDER LIFECYCLE CONTROLLERS
// ============================================================================

/**
 * Update order status
 * @route PATCH /api/orders/:id/status
 * @access Admin only
 * @body { status: string, reason?: string } - reason is optional, used for cancel/return
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status) {
        return res.status(400).json(
            new ApiResponse(400, null, "Status is required")
        );
    }

    const order = await UpdateOrderStatusService(id, status, reason);

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    );
});



// ============================================================================
// ANALYTICS CONTROLLERS
// ============================================================================

/**
 * Get order statistics
 * @route GET /api/orders/stats
 * @access Admin only
 */
const getOrderStats = asyncHandler(async (req, res) => {
    const stats = await GetOrderStatsService();

    return res.status(200).json(
        new ApiResponse(200, stats, "Statistics retrieved successfully")
    );
});

/**
 * Get orders by user
 * @route GET /api/orders/user/:userId
 * @access Admin only
 */
const getOrdersByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const orders = await GetOrdersByUserService(userId);

    return res.status(200).json(
        new ApiResponse(200, orders, "User orders retrieved successfully")
    );
});

/**
 * Get revenue report
 * @route GET /api/orders/revenue
 * @access Admin only
 */
const getRevenueReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const report = await GetRevenueReportService(startDate, endDate);

    return res.status(200).json(
        new ApiResponse(200, report, "Revenue report generated successfully")
    );
});

/**
 * Get top selling products
 * @route GET /api/orders/top-products
 * @access Admin only
 */
const getTopSellingProducts = asyncHandler(async (req, res) => {
    const { limit } = req.query;

    const products = await GetTopSellingProductsService(limit);

    return res.status(200).json(
        new ApiResponse(200, products, "Top selling products retrieved successfully")
    );
});

// ============================================================================
// BULK OPERATION CONTROLLERS
// ============================================================================

/**
 * Bulk update order status
 * @route PUT /api/orders/bulk/status
 * @access Admin only
 */
const bulkUpdateOrderStatus = asyncHandler(async (req, res) => {
    const { orderIds, status } = req.body;

    const result = await BulkUpdateOrderStatusService(orderIds, status);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully updated ${result.results.length} orders`
        )
    );
});

/**
 * Bulk cancel orders
 * @route PUT /api/orders/bulk/cancel
 * @access Admin only
 */
const bulkCancelOrders = asyncHandler(async (req, res) => {
    const { orderIds, reason } = req.body;

    const result = await BulkCancelOrdersService(orderIds, reason);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully cancelled ${result.results.length} orders`
        )
    );
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrderStats,
    getOrdersByUser,
    getRevenueReport,
    getTopSellingProducts,
    bulkUpdateOrderStatus,
    bulkCancelOrders
};
