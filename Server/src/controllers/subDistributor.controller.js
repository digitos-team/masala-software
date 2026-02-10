import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

/**
 * @desc    Get sub-distributor dashboard statistics
 * @route   GET /api/sub-distributor/stats
 * @access  Private (Retailer only)
 */
export const getSubDistributorStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Ensure only retailer role can access
    if (req.user.role !== "retailer") {
        throw new ApiError(403, "Access denied: Retailer role required");
    }

    // Get total orders count for this user only
    const totalOrders = await Order.countDocuments({ orderBy: userId });

    // Get pending orders count for this user only
    const pendingOrders = await Order.countDocuments({
        orderBy: userId,
        status: { $in: ["placed", "pending"] },
    });

    // Calculate total sales for this user only
    const salesData = await Order.aggregate([
        { $match: { orderBy: new mongoose.Types.ObjectId(userId), status: { $in: ["completed", "delivered"] } } },
        { $group: { _id: null, totalSales: { $sum: "$pricing.grandTotal" } } },
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Get total products count (products available for ordering)
    const activeProducts = await Product.countDocuments();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalOrders,
                pendingOrders,
                totalSales,
                activeProducts,
            },
            "Stats fetched successfully"
        )
    );
});

/**
 * @desc    Get all orders for the logged-in sub-distributor
 * @route   GET /api/sub-distributor/orders
 * @access  Private (Retailer only - own orders only)
 */
export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Only return orders created by this user
    const orders = await Order.find({ orderBy: userId })
        .populate("products.productId", "name")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

/**
 * @desc    Create a new order
 * @route   POST /api/sub-distributor/orders
 * @access  Private (Retailer only - can only create orders for themselves)
 */
export const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { products, deliveryAddress, notes } = req.body;

    if (!products || products.length === 0) {
        throw new ApiError(400, "Order must contain at least one product");
    }

    // Calculate total amount
    let subTotal = 0;
    const productDetails = [];

    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.productId}`);
        }
        const itemTotal = product.price * item.quantity;
        subTotal += itemTotal;

        productDetails.push({
            productId: item.productId,
            name: product.name,
            quantity: item.quantity,
            unitPrice: product.price,
            taxPercentage: 0,
            taxAmount: 0,
            totalPrice: itemTotal
        });
    }

    const order = await Order.create({
        orderBy: userId,
        orderByRole: "retailer",
        Orderno: `ORD${Date.now()}`,
        invoiceNumber: `INV${Date.now()}`,
        products: productDetails,
        pricing: {
            subTotal,
            taxAmount: 0,
            discountAmount: 0,
            shippingCharge: 0,
            grandTotal: subTotal
        },
        delivery: {
            address: deliveryAddress || "To be confirmed"
        },
        status: "placed",
    });

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});

/**
 * @desc    Get available products for sub-distributor
 * @route   GET /api/sub-distributor/products
 * @access  Private (Sub-Distributor only)
 */
export const getProducts = asyncHandler(async (req, res) => {
    // Products (read-only access for retailers)
    const products = await Product.find().select(
        "name pricing stock unit taxpercentage"
    );

    return res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

/**
 * @desc    Get sales chart data for sub-distributor
 * @route   GET /api/sub-distributor/sales?period=monthly
 * @access  Private (Sub-Distributor only)
 */
export const getSalesData = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { period = "monthly" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    if (period === "weekly") {
        startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === "yearly") {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    } else {
        // Default to monthly (last 6 months)
        startDate = new Date(now.setMonth(now.getMonth() - 6));
    }

    const salesData = await Order.aggregate([
        {
            $match: {
                orderBy: new mongoose.Types.ObjectId(userId),
                status: { $in: ["completed", "delivered"] },
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                sales: { $sum: "$pricing.grandTotal" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format data for chart
    const formattedData = salesData.map((item) => ({
        name: `${item._id.month}/${item._id.year}`,
        sales: item.sales,
    }));

    return res.status(200).json(
        new ApiResponse(200, formattedData, "Sales data fetched successfully")
    );
});

/**
 * @desc    Get user profile for logged-in sub-distributor
 * @route   GET /api/sub-distributor/profile
 * @access  Private (Retailer only)
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch complete user details
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Profile fetched successfully")
    );
});

