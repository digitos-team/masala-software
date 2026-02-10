import express from "express";
import {
    getSubDistributorStats,
    getMyOrders,
    createOrder,
    getProducts,
    getSalesData,
    getUserProfile,
} from "../controllers/subDistributor.controller.js";
import { verifyjwt, isRetailer } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require authentication AND retailer role
router.use(verifyjwt);
router.use(isRetailer);

// Dashboard stats (retailer can only see their own stats)
router.route("/stats").get(getSubDistributorStats);

// Orders management (retailer can only see/create their own orders)
router.route("/orders").get(getMyOrders).post(createOrder);

// Products (read-only access for retailers)
router.route("/products").get(getProducts);

// Sales data for charts (retailer can only see their own sales)
router.route("/sales").get(getSalesData);

// User profile (retailer can only see their own profile)
router.route("/profile").get(getUserProfile);

export default router;
