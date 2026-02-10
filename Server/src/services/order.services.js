import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";


/**
 * Generate auto-incrementing order number
 * Format: ORD-YYYY-XXX (e.g., ORD-2026-001)
 */
const generateOrderno = async () => {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `ORD-${currentYear}-`;

    // Find the latest order for the current year
    const lastOrder = await Order.findOne({
        Orderno: { $regex: `^${yearPrefix}` }
    }).sort({ createdAt: -1 });

    let nextSequence = 1;

    if (lastOrder && lastOrder.Orderno) {
        // Extract the sequence number from the last order number
        const parts = lastOrder.Orderno.split("-");
        const lastSequence = parseInt(parts[2]);
        if (!isNaN(lastSequence)) {
            nextSequence = lastSequence + 1;
        }
    }

    // Pad with zeros to ensure 3 digits (e.g., 001, 010, 100)
    const paddedSequence = String(nextSequence).padStart(3, "0");
    return `${yearPrefix}${paddedSequence}`;
};

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Create a new order
 */
const CreateOrderService = async (orderData, userId, userRole) => {
    const {
        invoiceNumber,
        distributorId,
        subDistributorId,
        products,
        pricing,
        delivery,
        status
    } = orderData;

    // Strictly generate Orderno internally
    const Orderno = await generateOrderno();

    // Validation
    if (!Orderno || !invoiceNumber || !products || products.length === 0) {
        throw new ApiError(400, "Order number (Orderno), invoice number, and products are required");
    }

    if (!pricing || !pricing.subTotal || !pricing.grandTotal) {
        throw new ApiError(400, "Pricing details (subTotal and grandTotal) are required");
    }

    if (!delivery || !delivery.address) {
        throw new ApiError(400, "Delivery address is required");
    }

    // Check if order number already exists
    const existingOrder = await Order.findOne({ Orderno });
    if (existingOrder) {
        throw new ApiError(400, "Order with this order number already exists");
    }

    // Validate and update stock for each product
    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
    }

    // Create order
    const order = await Order.create({
        orderBy: userId,
        orderByRole: userRole,
        Orderno,
        invoiceNumber,
        distributorId,
        subDistributorId,
        products,
        pricing,
        delivery,
        status: status || "placed"
    });

    // Update stock for each product
    for (const item of products) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
        );
    }

    return order;
};

/**
 * Get order by ID
 */
const GetOrderByIdService = async (orderId, userRole, userId) => {
    const order = await Order.findById(orderId)
        .populate("orderBy", "name email role")
        .populate("distributorId", "name email")
        .populate("subDistributorId", "name email")
        .populate("products.productId", "name unit");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Role-based access: non-admin users can only see their own orders or orders assigned to them
    if (userRole !== "admin") {
        const isOwner = order.orderBy._id.toString() === userId.toString(); // ._id is needed because of populate? No, populate returns object. But if it's populated, check ._id or .toString() on object? 
        // Wait, populate replaces the ID with the object. So order.orderBy is an object now.
        // order.orderBy._id.toString() is safer.
        // Let's check if populate is used. Yes: .populate("orderBy", "name email role")

        const ownerId = order.orderBy?._id?.toString() || order.orderBy?.toString();
        const distId = order.distributorId?._id?.toString() || order.distributorId?.toString();
        const subDistId = order.subDistributorId?._id?.toString() || order.subDistributorId?.toString();

        console.log("Debug Order Access:", {
            orderId,
            userId: userId.toString(),
            ownerId,
            distId,
            subDistId,
            userRole
        });

        const hasAccess =
            ownerId === userId.toString() ||
            distId === userId.toString() ||
            subDistId === userId.toString();

        if (!hasAccess) {
            console.log("Access Denied for user:", userId.toString());
            throw new ApiError(403, "You don't have permission to view this order");
        }
    }

    return order;
};

/**
 * Update order by ID
 */
/**
 * Update order by ID
 */
const UpdateOrderService = async (orderId, updateData, userRole, userId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Role-based access control
    // Role-based access control
    if (userRole !== "admin") {
        // Usage: const order = await Order.findById(orderId); -> No populate here usually, but let's be safe
        const getIdString = (field) => {
            if (!field) return null;
            if (field._id) return field._id.toString();
            return field.toString();
        };

        const ownerId = getIdString(order.orderBy);
        const distId = getIdString(order.distributorId);
        const subDistId = getIdString(order.subDistributorId);

        const hasAccess =
            ownerId === userId.toString() ||
            distId === userId.toString() ||
            subDistId === userId.toString();

        if (!hasAccess) {
            throw new ApiError(403, "You don't have permission to update this order");
        }
    }

    // Prevent updating certain fields after order is confirmed
    if (order.status !== "placed" && (updateData.products || updateData.pricing)) {
        throw new ApiError(400, "Cannot modify products or pricing after order is confirmed");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate("orderBy", "name email")
        .populate("distributorId", "name email")
        .populate("subDistributorId", "name email")
        .populate("products.productId", "name unit");

    return updatedOrder;
};

/**
 * Delete order by ID
 */
const DeleteOrderService = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Only allow deletion of placed or cancelled orders
    if (!["placed", "cancelled"].includes(order.status)) {
        throw new ApiError(400, "Cannot delete orders that are confirmed, shipped, or delivered");
    }

    // Restore stock if order is being deleted
    if (order.status === "placed") {
        for (const item of order.products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }
    }

    await Order.findByIdAndDelete(orderId);
    return { message: "Order deleted successfully" };
};

// ============================================================================
// ADVANCED QUERY OPERATIONS
// ============================================================================

/**
 * Get all orders with filtering, pagination, and sorting
 */
const GetAllOrdersService = async (queryParams, userRole, userId) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        status,
        startDate,
        endDate,
        distributorId,
        subDistributorId,
        search = ""
    } = queryParams;

    // Build query
    const query = {};

    // Non-admin users can only see their own orders OR orders placed to them as a supplier
    if (userRole !== "admin") {
        query.$or = [
            { orderBy: userId },
            { distributorId: userId },
            { subDistributorId: userId }
        ];
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by distributor
    if (distributorId) {
        query.distributorId = distributorId;
    }

    // Filter by sub-distributor
    if (subDistributorId) {
        query.subDistributorId = subDistributorId;
    }

    // Filter by date range
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search by order number or invoice number
    if (search) {
        query.$or = [
            { Orderno: { $regex: search, $options: "i" } },
            { invoiceNumber: { $regex: search, $options: "i" } }
        ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const orders = await Order.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("orderBy", "name email")
        .populate("distributorId", "name email")
        .populate("subDistributorId", "name email")
        .populate("products.productId", "name unit");

    const totalOrders = await Order.countDocuments(query);

    return {
        orders,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalOrders / Number(limit)),
            totalOrders,
            hasMore: skip + orders.length < totalOrders
        }
    };
};



// ============================================================================
// ORDER LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Update order status
 * Now handles cancel and return logic automatically
 */
const UpdateOrderStatusService = async (orderId, newStatus, reason = null, userRole = "admin", userId = null) => {
    const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled", "returned"];

    if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Permission check: Admin or Supplier of the order
    if (userRole !== "admin") {
        if (!userId) {
            throw new ApiError(401, "User ID is required for non-admin status updates");
        }

        const getIdString = (field) => {
            if (!field) return null;
            if (field._id) return field._id.toString();
            return field.toString();
        };

        const distId = getIdString(order.distributorId);
        const subDistId = getIdString(order.subDistributorId);

        if (distId !== userId.toString() && subDistId !== userId.toString()) {
            throw new ApiError(403, "You don't have permission to update the status of this order as you are not the supplier");
        }
    }

    // Validate status transition
    if (order.status === "delivered" && newStatus !== "returned") {
        throw new ApiError(400, "Delivered orders can only be returned");
    }

    if (order.isCancelled && newStatus !== "cancelled") {
        throw new ApiError(400, "Cannot update status of cancelled orders");
    }

    if (order.isReturned) {
        throw new ApiError(400, "Cannot update status of returned orders");
    }

    // Prevent cancelling delivered orders
    if (newStatus === "cancelled" && order.status === "delivered") {
        throw new ApiError(400, "Cannot cancel delivered orders. Please use return instead");
    }

    // Validate return - only delivered orders can be returned
    if (newStatus === "returned" && order.status !== "delivered") {
        throw new ApiError(400, "Only delivered orders can be returned");
    }

    // Initialize update data
    const updateData = { status: newStatus };

    // Handle CANCELLED status
    if (newStatus === "cancelled") {
        // Restore stock for cancelled orders
        for (const item of order.products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }

        updateData.isCancelled = true;
        updateData.cancelReason = reason || "No reason provided";
        updateData.cancelledAt = new Date();
    }

    // Handle RETURNED status
    if (newStatus === "returned") {
        // Restore stock for returned orders
        for (const item of order.products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }

        updateData.isReturned = true;
        updateData.returnReason = reason || "No reason provided";
        updateData.returnedAt = new Date();
    }

    // Handle DELIVERED status - SYNC STOCK TO RECIPIENT
    if (newStatus === "delivered") {
        updateData["delivery.deliveredAt"] = new Date();

        // Recipient is the user who placed the order or the assigned sub-distributor
        const recipientId = order.subDistributorId || order.orderBy;

        for (const item of order.products) {
            // Find existing product for this user that points to the original admin product
            let recipientProduct = await Product.findOne({
                createdBy: recipientId,
                parentProductId: item.productId
            });

            if (!recipientProduct) {
                // If not exists, fetch original product details to create copy
                const originalProduct = await Product.findById(item.productId);
                if (originalProduct) {
                    recipientProduct = await Product.create({
                        name: originalProduct.name,
                        unit: originalProduct.unit,
                        quantity: originalProduct.quantity,
                        pricing: originalProduct.pricing,
                        taxpercentage: originalProduct.taxpercentage,
                        minStockAlert: originalProduct.minStockAlert,
                        stock: item.quantity, // Initial stock from this delivery
                        totalPrice: originalProduct.totalPrice,
                        createdBy: recipientId,
                        parentProductId: item.productId
                    });
                }
            } else {
                // Update existing product stock
                await Product.findByIdAndUpdate(recipientProduct._id, {
                    $inc: { stock: item.quantity }
                });
            }
        }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true }
    ).populate("orderBy", "name email")
        .populate("distributorId", "name email")
        .populate("products.productId", "name unit");

    return updatedOrder;
};



// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Get order statistics
 */
const GetOrderStatsService = async () => {
    const totalOrders = await Order.countDocuments();

    const ordersByStatus = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const revenueData = await Order.aggregate([
        {
            $match: { status: { $nin: ["cancelled", "returned"] } }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$pricing.grandTotal" }
            }
        }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    return {
        totalOrders,
        ordersByStatus,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        currency: "INR"
    };
};

/**
 * Get orders by specific user
 */
const GetOrdersByUserService = async (userId) => {
    const orders = await Order.find({ orderBy: userId })
        .sort({ createdAt: -1 })
        .populate("orderBy", "name email")
        .populate("distributorId", "name email")
        .populate("products.productId", "name unit");

    return orders;
};

/**
 * Get revenue report by date range
 */
const GetRevenueReportService = async (startDate, endDate) => {
    const query = {
        status: { $nin: ["cancelled", "returned"] }
    };

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const revenueData = await Order.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$pricing.grandTotal" },
                totalOrders: { $sum: 1 },
                averageOrderValue: { $avg: "$pricing.grandTotal" }
            }
        }
    ]);

    const result = revenueData.length > 0 ? revenueData[0] : {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
    };

    return {
        totalRevenue: parseFloat(result.totalRevenue.toFixed(2)),
        totalOrders: result.totalOrders,
        averageOrderValue: parseFloat(result.averageOrderValue.toFixed(2)),
        currency: "INR",
        dateRange: { startDate, endDate }
    };
};

/**
 * Get top selling products from orders
 */
const GetTopSellingProductsService = async (limit = 10) => {
    const topProducts = await Order.aggregate([
        { $match: { status: { $nin: ["cancelled", "returned"] } } },
        { $unwind: "$products" },
        {
            $group: {
                _id: "$products.productId",
                productName: { $first: "$products.name" },
                totalQuantitySold: { $sum: "$products.quantity" },
                totalRevenue: { $sum: "$products.totalPrice" }
            }
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: Number(limit) }
    ]);

    return topProducts;
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk update order status
 */
const BulkUpdateOrderStatusService = async (orderIds, newStatus) => {
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
        throw new ApiError(400, "Order IDs array is required");
    }

    const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled", "returned"];

    if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const results = [];
    const errors = [];

    for (const orderId of orderIds) {
        try {
            const updatedOrder = await UpdateOrderStatusService(orderId, newStatus);
            results.push({
                orderId,
                success: true,
                newStatus: updatedOrder.status
            });
        } catch (error) {
            errors.push({
                orderId,
                success: false,
                error: error.message
            });
        }
    }

    return { results, errors };
};

/**
 * Bulk cancel orders
 */
const BulkCancelOrdersService = async (orderIds, cancelReason) => {
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
        throw new ApiError(400, "Order IDs array is required");
    }

    const results = [];
    const errors = [];

    for (const orderId of orderIds) {
        try {
            const cancelledOrder = await CancelOrderService(orderId, cancelReason);
            results.push({
                orderId,
                success: true
            });
        } catch (error) {
            errors.push({
                orderId,
                success: false,
                error: error.message
            });
        }
    }

    return { results, errors };
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
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
};
