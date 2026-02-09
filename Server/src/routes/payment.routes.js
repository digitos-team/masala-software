import express from "express";
import {
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
} from "../controllers/payment.controllers.js";
import { verifyjwt, isAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// ============================================================================
// STATIC ROUTES - MUST BE DEFINED FIRST TO AVOID CONFLICTS WITH DYNAMIC ROUTES
// ============================================================================

// ============================================================================
// PUBLIC/AUTHENTICATED ROUTES
// All authenticated users can access these routes
// ============================================================================

// Get all payments (filtered by user for non-admin)
router.route("/getpayments").get(verifyjwt, getAllPayments);

// Create new payment
router.route("/createpayment").post(verifyjwt, createPayment);

// Search payments
router.route("/search").get(verifyjwt, searchPayments);

// Filter payments by status
router.route("/filter/status").get(verifyjwt, filterPaymentsByStatus);

// Filter payments by method
router.route("/filter/method").get(verifyjwt, filterPaymentsByMethod);

// ============================================================================
// ADMIN-ONLY ROUTES
// Only admin users can access these routes
// ============================================================================

// Get payment statistics
router.route("/paymentstats").get(verifyjwt, isAdmin, getPaymentStats);

// Get payment history
router.route("/paymenthistory").get(verifyjwt, isAdmin, getPaymentHistory);

// Get revenue by payment method
router.route("/paymentrevenue").get(verifyjwt, isAdmin, getRevenueByMethod);

// ============================================================================
// BULK OPERATION ROUTES (ADMIN ONLY)
// ============================================================================

// Bulk create payments
router.route("/bulk/create").post(verifyjwt, isAdmin, bulkCreatePayments);

// Bulk update payment status
router.route("/bulk/status").patch(verifyjwt, isAdmin, bulkUpdatePaymentStatus);

// ============================================================================
// DYNAMIC ROUTES - MUST BE DEFINED LAST TO AVOID ROUTE CONFLICTS
// ============================================================================

// Get single payment by ID
router.route("/getpaymentbyid/:id").get(verifyjwt, getPayment);

// Update payment
router.route("/updatepayment/:id").patch(verifyjwt, isAdmin, updatePayment);

// Delete payment
router.route("/deletepayment/:id").delete(verifyjwt, isAdmin, deletePayment);

// Get payments by order
router.route("/order/:orderId").get(verifyjwt, getPaymentsByOrder);



// Verify payment by transaction ID
router.route("/verify/:transactionId").get(verifyjwt, verifyPayment);

export default router;
