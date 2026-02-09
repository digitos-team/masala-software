import { Payment } from "../models/payments.model.js";
import { Order } from "../models/order.models.js";
import { ApiError } from "../utils/ApiError.js";



// Create a new payment
const CreatePaymentService = async (paymentData, userId) => {
    const {
        orderId,
        amount,
        method,
        Paymentstatus,
        transactionId
    } = paymentData;

    if (!orderId || !method || !Paymentstatus || !transactionId) {
        throw new ApiError(400, "Order ID, method, payment status, and transaction ID are required");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Check if transaction ID already exists (prevent duplicate payments)
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
        throw new ApiError(400, "Payment with this transaction ID already exists");
    }

    // Calculate already paid amount
    const totalPaid = await Payment.aggregate([
        { $match: { orderId: order._id, Paymentstatus: "Completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const alreadyPaid = totalPaid.length > 0 ? totalPaid[0].total : 0;
    const remainingAmount = order.pricing.grandTotal - alreadyPaid;

    // Check if order is already fully paid
    if (remainingAmount <= 0) {
        throw new ApiError(400, "Order is already fully paid");
    }

    // Determine payment amount
    let paymentAmount;
    if (amount) {
        // If amount provided, validate it doesn't exceed remaining
        if (amount > remainingAmount) {
            throw new ApiError(400, `Payment amount exceeds remaining balance. Remaining: ₹${remainingAmount}`);
        }
        paymentAmount = amount;
    } else {
        // If no amount provided, auto-calculate remaining balance
        paymentAmount = remainingAmount;
    }

    // Create payment
    const payment = await Payment.create({
        orderId,
        amount: paymentAmount,
        method,
        Paymentstatus,
        transactionId,
        paidBy: userId,
        paidAt: new Date()
    });

    return payment;
};

//get payment by id
const GetPaymentByIdService = async (paymentId, userRole, userId) => {
    const payment = await Payment.findById(paymentId)
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Role-based access: non-admin users can only see payments for their orders
    if (userRole !== "admin") {
        const order = await Order.findById(payment.orderId);
        if (order.orderBy.toString() !== userId.toString()) {
            throw new ApiError(403, "You don't have permission to view this payment");
        }
    }

    return payment;
};

//update payment by id
const UpdatePaymentService = async (paymentId, updateData) => {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Prevent updating certain fields for completed payments
    if (payment.Paymentstatus === "Completed" && updateData.amount) {
        throw new ApiError(400, "Cannot modify amount for completed payments");
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    return updatedPayment;
};

//delete payment by id
const DeletePaymentService = async (paymentId) => {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    // Only allow deletion of failed/pending payments
    if (payment.Paymentstatus === "Completed") {
        throw new ApiError(400, "Cannot delete completed payments");
    }

    await Payment.findByIdAndDelete(paymentId);
    return { message: "Payment deleted successfully" };
};

//get all payments with filtering, pagination, and sorting
const GetAllPaymentsService = async (queryParams, userRole, userId) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        status,
        method,
        startDate,
        endDate,
        orderId,
        search = ""
    } = queryParams;

    // Build query
    const query = {};

    // Non-admin users can only see payments for their orders
    if (userRole !== "admin") {
        const userOrders = await Order.find({ orderBy: userId }).select("_id");
        const orderIds = userOrders.map(order => order._id);
        query.orderId = { $in: orderIds };
    }

    // Filter by status
    if (status) {
        query.Paymentstatus = status;
    }

    // Filter by method
    if (method) {
        query.method = method;
    }

    // Filter by order
    if (orderId) {
        query.orderId = orderId;
    }

    // Filter by date range
    if (startDate || endDate) {
        query.paidAt = {};
        if (startDate) query.paidAt.$gte = new Date(startDate);
        if (endDate) query.paidAt.$lte = new Date(endDate);
    }

    // Search by transaction ID
    if (search) {
        query.transactionId = { $regex: search, $options: "i" };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const payments = await Payment.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    const totalPayments = await Payment.countDocuments(query);

    return {
        payments,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalPayments / Number(limit)),
            totalPayments,
            hasMore: skip + payments.length < totalPayments
        }
    };
};

//search payments by transaction ID
const SearchPaymentsByTransactionIdService = async (searchTerm, userRole, userId) => {
    if (!searchTerm || searchTerm.trim() === "") {
        throw new ApiError(400, "Search term is required");
    }

    const query = {
        transactionId: { $regex: searchTerm, $options: "i" }
    };

    // Non-admin users can only search their own payments
    if (userRole !== "admin") {
        const userOrders = await Order.find({ orderBy: userId }).select("_id");
        const orderIds = userOrders.map(order => order._id);
        query.orderId = { $in: orderIds };
    }

    const payments = await Payment.find(query)
        .limit(20)
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    return payments;
};

//filter payments by status
const FilterPaymentsByStatusService = async (status, userRole, userId) => {
    const validStatuses = ["Pending", "Partially_Paid", "Completed", "Failed", "Refunded"];

    // Normalize status format (e.g. "Partially Paid" -> "Partially_Paid", "partially paid" -> "Partially_Paid")
    if (status) {
        // Trim and replace all spaces with underscores
        const normalized = status.trim().replace(/\s+/g, "_");

        // Find case-insensitive match
        const match = validStatuses.find(s => s.toLowerCase() === normalized.toLowerCase());
        status = match || normalized;
    }

    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const query = { Paymentstatus: status };

    // Non-admin users can only see their own payments
    if (userRole !== "admin") {
        const userOrders = await Order.find({ orderBy: userId }).select("_id");
        const orderIds = userOrders.map(order => order._id);
        query.orderId = { $in: orderIds };
    }

    const payments = await Payment.find(query)
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    return payments;
};

//filter payments by method
const FilterPaymentsByMethodService = async (method, userRole, userId) => {
    const validMethods = ["UPI", "Cash", "Card", "Net Banking", "Wallet", "Other"];

    // Normalize method format (e.g. "Net_Banking" -> "Net Banking", "net banking" -> "Net Banking")
    if (method) {
        // Trim and replace all underscores with spaces
        const normalized = method.trim().replace(/_/g, " ");

        // Find case-insensitive match
        const match = validMethods.find(m => m.toLowerCase() === normalized.toLowerCase());
        method = match || normalized;
    }

    if (!validMethods.includes(method)) {
        throw new ApiError(400, `Invalid payment method. Must be one of: ${validMethods.join(", ")}`);
    }

    const query = { method };

    // Non-admin users can only see their own payments
    if (userRole !== "admin") {
        const userOrders = await Order.find({ orderBy: userId }).select("_id");
        const orderIds = userOrders.map(order => order._id);
        query.orderId = { $in: orderIds };
    }

    const payments = await Payment.find(query)
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    return payments;
};

//get all payments for a specific order
const GetPaymentsByOrderService = async (orderId, userRole, userId) => {
    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Role-based access
    if (userRole !== "admin" && order.orderBy.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to view payments for this order");
    }

    const payments = await Payment.find({ orderId })
        .sort({ paidAt: -1 })
        .populate("paidBy", "name email");

    // Calculate payment summary
    const summary = await Payment.aggregate([
        { $match: { orderId: order._id } },
        {
            $group: {
                _id: "$Paymentstatus",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        }
    ]);

    const successfulPayments = summary.find(s => s._id === "Completed") || { totalAmount: 0, count: 0 };
    const remainingAmount = order.pricing.grandTotal - successfulPayments.totalAmount;

    return {
        orderId,
        orderTotal: order.pricing.grandTotal,
        totalPaid: successfulPayments.totalAmount,
        remainingAmount,
        paymentCount: successfulPayments.count,
        payments,
        summary
    };
};



//verify payment status
const VerifyPaymentService = async (transactionId) => {
    const payment = await Payment.findOne({ transactionId })
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    return {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        status: payment.Paymentstatus,
        amount: payment.amount,
        method: payment.method,
        paidAt: payment.paidAt,
        order: payment.orderId
    };
};

//get payment statistics
const GetPaymentStatsService = async () => {
    const totalPayments = await Payment.countDocuments();

    const paymentsByStatus = await Payment.aggregate([
        {
            $group: {
                _id: "$Paymentstatus",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);

    const paymentsByMethod = await Payment.aggregate([
        {
            $group: {
                _id: "$method",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);

    const successfulPayments = paymentsByStatus.find(p => p._id === "Completed") || { totalAmount: 0 };
    const totalRevenue = successfulPayments.totalAmount;

    return {
        totalPayments,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        paymentsByStatus,
        paymentsByMethod,
        currency: "INR"
    };
};

//get revenue by payment method
const GetRevenueByMethodService = async (startDate, endDate) => {
    const query = { Paymentstatus: "Completed" };

    if (startDate || endDate) {
        query.paidAt = {};
        if (startDate) query.paidAt.$gte = new Date(startDate);
        if (endDate) query.paidAt.$lte = new Date(endDate);
    }

    const revenueByMethod = await Payment.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$method",
                totalRevenue: { $sum: "$amount" },
                transactionCount: { $sum: 1 },
                averageTransaction: { $avg: "$amount" }
            }
        },
        { $sort: { totalRevenue: -1 } }
    ]);

    return {
        revenueByMethod,
        dateRange: { startDate, endDate },
        currency: "INR"
    };
};

//get payment history with filtering
const GetPaymentHistoryService = async (filters) => {
    const { startDate, endDate, status, method, limit = 50 } = filters;

    const query = {};

    if (status) query.Paymentstatus = status;
    if (method) query.method = method;

    if (startDate || endDate) {
        query.paidAt = {};
        if (startDate) query.paidAt.$gte = new Date(startDate);
        if (endDate) query.paidAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
        .sort({ paidAt: -1 })
        .limit(Number(limit))
        .populate("orderId", "Orderno invoiceNumber pricing")
        .populate("paidBy", "name email");

    const totalAmount = await Payment.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);

    return {
        payments,
        totalCount: payments.length,
        totalAmount: totalAmount.length > 0 ? parseFloat(totalAmount[0].total.toFixed(2)) : 0,
        currency: "INR"
    };
};

//bulk create payments
const BulkCreatePaymentsService = async (paymentsData, userId) => {
    if (!Array.isArray(paymentsData) || paymentsData.length === 0) {
        throw new ApiError(400, "Payments array is required");
    }

    const results = [];
    const errors = [];

    for (const paymentData of paymentsData) {
        try {
            const payment = await CreatePaymentService(paymentData, userId);
            results.push({
                success: true,
                payment
            });
        } catch (error) {
            errors.push({
                success: false,
                data: paymentData,
                error: error.message
            });
        }
    }

    return { results, errors };
};

//bulk update payment status
const BulkUpdatePaymentStatusService = async (paymentIds, newStatus) => {
    if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
        throw new ApiError(400, "Payment IDs array is required");
    }

    const validStatuses = ["Pending", "Partially_Paid", "Completed", "Failed", "Refunded"];

    if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const results = [];
    const errors = [];

    for (const paymentId of paymentIds) {
        try {
            const updatedPayment = await UpdatePaymentService(paymentId, { Paymentstatus: newStatus });
            results.push({
                paymentId,
                success: true,
                newStatus: updatedPayment.Paymentstatus
            });
        } catch (error) {
            errors.push({
                paymentId,
                success: false,
                error: error.message
            });
        }
    }

    return { results, errors };
};


export {
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
};
