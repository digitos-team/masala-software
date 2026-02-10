import express from "express";
import {
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
} from "../controllers/product.controllers.js";
import { verifyjwt, isAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();


// ============================================================================
// PUBLIC/AUTHENTICATED ROUTES (SPECIFIC PATHS FIRST)
// All authenticated users can access these routes
// ============================================================================

// Get all products
router.route("/getallproducts").get(verifyjwt, getAllProducts);

// Search products (MUST be before /:id)
router.route("/search").get(verifyjwt, searchProducts);

// Filter products by price range (MUST be before /:id)
router.route("/filter/price").get(verifyjwt, filterProductsByPrice);

// ============================================================================
// ADMIN-ONLY ROUTES (SPECIFIC PATHS FIRST)
// Only admin users can access these routes
// ============================================================================

// Create new product
router.route("/addproduct").post(verifyjwt, createProduct); // Controller should handle role check or use a combined middleware

// Get low stock products (MUST be before /:id routes)
router.route("/lowstock").get(verifyjwt, isAdmin, getLowStockProducts);

// Get product statistics (MUST be before /:id routes)
router.route("/stats").get(verifyjwt, isAdmin, getProductStats);

// Get inventory value (MUST be before /:id routes)
router.route("/inventory/value").get(verifyjwt, isAdmin, getInventoryValue);

// ============================================================================
// PARAMETERIZED ROUTES (MUST BE AFTER SPECIFIC ROUTES)
// ============================================================================

// Get single product by ID
router.route("/getproduct/:id").get(verifyjwt, getProduct);

// Update product
router.route("/updateproduct/:id").patch(verifyjwt, updateProduct);

// Delete product
router.route("/deleteproduct/:id").delete(verifyjwt, deleteProduct);

// Update product stock
router.route("/updatestock/:id").patch(verifyjwt, updateStock);

// Check stock availability
router.route("/check-stock/:id").get(verifyjwt, checkStockAvailability);

// Get products by user
router.route("/user/:userId").get(verifyjwt, getProductsByUser);

// ============================================================================
// BULK OPERATION ROUTES (ADMIN ONLY)
// ============================================================================

// Bulk create products
router.route("/bulkcreateproduct").post(verifyjwt, isAdmin, bulkCreateProducts);

// Bulk update products
router.route("/bulkupdateproduct").patch(verifyjwt, isAdmin, bulkUpdateProducts);

// Bulk delete products
router.route("/bulkdeleteproduct").delete(verifyjwt, isAdmin, bulkDeleteProducts);

// Bulk update stock
router.route("/bulkupdatestock").patch(verifyjwt, isAdmin, bulkUpdateStock);

export default router;
