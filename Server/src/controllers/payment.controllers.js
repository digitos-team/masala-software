import {
    CreatePaymentService,
    GetPaymentByIdService,
    UpdatePaymentService,
    DeletePaymentService,
    GetAllPaymentsService,
    SearchPaymentsByTransactionIdService,
    FilterPaymentsByStatusService,
    FilterPaymentsByMethodService,
    GetPaymentsByOrderService,
    VerifyPaymentService,
    GetPaymentStatsService,
    GetRevenueByMethodService,
    GetPaymentHistoryService,
    BulkCreatePaymentsService,
    BulkUpdatePaymentStatusService
} from "../services/payment.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ============================================================================
// CRUD CONTROLLERS
// ============================================================================

/**
 * Create a new payment
 * @route POST /api/payments/create
 * @access Authenticated users
 */
const createPayment = asyncHandler(async (req, res) => {
    const payment = await CreatePaymentService(req.body, req.user._id);

    return res.status(201).json(
        new ApiResponse(201, payment, "Payment created successfully")
    );
});

/**
 * Get single payment by ID
 * @route GET /api/payments/get/:id
 * @access Authenticated users (own payments) / Admin (all payments)
 */
const getPayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user._id;

    const payment = await GetPaymentByIdService(id, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, payment, "Payment retrieved successfully")
    );
});

/**
 * Get all payments with filters, pagination, and sorting
 * @route GET /api/payments/getpayments
 * @access Authenticated users
 */
const getAllPayments = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user._id;

    const result = await GetAllPaymentsService(req.query, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, result, "Payments retrieved successfully")
    );
});

/**
 * Update payment by ID
 * @route PUT /api/payments/update/:id
 * @access Admin only
 */
const updatePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payment = await UpdatePaymentService(id, req.body);

    return res.status(200).json(
        new ApiResponse(200, payment, "Payment updated successfully")
    );
});

/**
 * Delete payment by ID
 * @route DELETE /api/payments/delete/:id
 * @access Admin only
 */
const deletePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await DeletePaymentService(id);

    return res.status(200).json(
        new ApiResponse(200, result, "Payment deleted successfully")
    );
});

// ============================================================================
// SEARCH & FILTER CONTROLLERS
// ============================================================================

/**
 * Search payments by transaction ID
 * @route POST /api/payments/search
 * @access Authenticated users
 */
const searchPayments = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;
    const userRole = req.user.role;
    const userId = req.user._id;

    const payments = await SearchPaymentsByTransactionIdService(searchTerm, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, payments, "Search completed successfully")
    );
});

/**
 * Filter payments by status
 * @route GET /api/payments/filter/status
 * @access Authenticated users
 */
const filterPaymentsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const userRole = req.user.role;
    const userId = req.user._id;

    const payments = await FilterPaymentsByStatusService(status, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, payments, "Payments filtered successfully")
    );
});

/**
 * Filter payments by method
 * @route GET /api/payments/filter/method
 * @access Authenticated users
 */
const filterPaymentsByMethod = asyncHandler(async (req, res) => {
    const { method } = req.query;
    const userRole = req.user.role;
    const userId = req.user._id;

    const payments = await FilterPaymentsByMethodService(method, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, payments, "Payments filtered successfully")
    );
});

// ============================================================================
// PAYMENT-ORDER CONTROLLERS
// ============================================================================

/**
 * Get all payments for a specific order
 * @route GET /api/payments/order/:orderId
 * @access Authenticated users (own orders) / Admin (all orders)
 */
const getPaymentsByOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userRole = req.user.role;
    const userId = req.user._id;

    const result = await GetPaymentsByOrderService(orderId, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, result, "Order payments retrieved successfully")
    );
});


/**
 * Verify payment by transaction ID
 * @route GET /api/payments/verify/:transactionId
 * @access Authenticated users
 */
const verifyPayment = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    const result = await VerifyPaymentService(transactionId);

    return res.status(200).json(
        new ApiResponse(200, result, "Payment verified successfully")
    );
});

// ============================================================================
// ANALYTICS CONTROLLERS
// ============================================================================

/**
 * Get payment statistics
 * @route GET /api/payments/stats
 * @access Authenticated users
 */
const getPaymentStats = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user._id;

    const stats = await GetPaymentStatsService(req.query, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, stats, "Statistics retrieved successfully")
    );
});

/**
 * Get revenue by payment method
 * @route GET /api/payments/revenue/method
 * @access Admin only
 */
const getRevenueByMethod = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const result = await GetRevenueByMethodService(startDate, endDate);

    return res.status(200).json(
        new ApiResponse(200, result, "Revenue by method retrieved successfully")
    );
});

/**
 * Get payment history
 * @route GET /api/payments/history
 * @access Authenticated users
 */
const getPaymentHistory = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user._id;

    const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        status: req.query.status,
        method: req.query.method,
        limit: req.query.limit,
        distributorId: req.query.distributorId
    };

    const result = await GetPaymentHistoryService(filters, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, result, "Payment history retrieved successfully")
    );
});

// ============================================================================
// BULK OPERATION CONTROLLERS
// ============================================================================

/**
 * Bulk create payments
 * @route POST /api/payments/bulk/create
 * @access Admin only
 */
const bulkCreatePayments = asyncHandler(async (req, res) => {
    const { payments } = req.body;

    const result = await BulkCreatePaymentsService(payments, req.user._id);

    return res.status(201).json(
        new ApiResponse(
            201,
            result,
            `Successfully created ${result.results.length} payments`
        )
    );
});

/**
 * Bulk update payment status
 * @route PUT /api/payments/bulk/status
 * @access Admin only
 */
const bulkUpdatePaymentStatus = asyncHandler(async (req, res) => {
    const { paymentIds, status } = req.body;

    const result = await BulkUpdatePaymentStatusService(paymentIds, status);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully updated ${result.results.length} payments`
        )
    );
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    createPayment,
    getPayment,
    getAllPayments,
    updatePayment,
    deletePayment,
    searchPayments,
    filterPaymentsByStatus,
    filterPaymentsByMethod,
    getPaymentsByOrder,
    verifyPayment,
    getPaymentStats,
    getRevenueByMethod,
    getPaymentHistory,
    bulkCreatePayments,
    bulkUpdatePaymentStatus
};
