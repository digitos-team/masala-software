import express from "express";
import {
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
} from "../controllers/order.controllers.js";
import { verifyjwt, isAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// ============================================================================
// PUBLIC/AUTHENTICATED ROUTES
// All authenticated users can access these routes
// ============================================================================

// Get all orders (filtered by user for non-admin)
router.route("/getorders").get(verifyjwt, getAllOrders);

// Get single order by ID
router.route("/getorderbyid/:id").get(verifyjwt, getOrder);



// ============================================================================
// AUTHENTICATED USER ROUTES
// Users can create their own orders
// ============================================================================

// Create new order
router.route("/neworder").post(verifyjwt, createOrder);

// ============================================================================
// ADMIN-ONLY ROUTES
// Only admin users can access these routes
// ============================================================================

// Update order (Distributors can update own orders, Admins can update any)
router.route("/updateorder/:id").patch(verifyjwt, updateOrder);

// Delete order
router.route("/deleteorder/:id").delete(verifyjwt, isAdmin, deleteOrder);

// Update order status
router.route("/updatestatus/:id").patch(verifyjwt, isAdmin, updateOrderStatus);



// Get order statistics
router.route("/orderstats").get(verifyjwt, isAdmin, getOrderStats);

// Get orders by user
router.route("/user/:userId").get(verifyjwt, isAdmin, getOrdersByUser);

// Get revenue report
router.route("/revenue").get(verifyjwt, isAdmin, getRevenueReport);

// Get top selling products
router.route("/top-products").get(verifyjwt, isAdmin, getTopSellingProducts);

// ============================================================================
// BULK OPERATION ROUTES (ADMIN ONLY)
// ============================================================================

// Bulk update order status
router.route("/bulkupdate/status").patch(verifyjwt, isAdmin, bulkUpdateOrderStatus);

// Bulk cancel orders
router.route("/bulkcancel").patch(verifyjwt, isAdmin, bulkCancelOrders);

export default router;
