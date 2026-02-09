import express from "express";
import {
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    getUserAddresses,
    getDefaultAddress,
    setDefaultAddress
} from "../controllers/address.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// ============================================================================
// AUTHENTICATED USER ROUTES
// Users can manage their own addresses
// ============================================================================

// Get current user's addresses
router.route("/getuseraddresses").get(verifyjwt, getUserAddresses);

// Get single address by ID
router.route("/getaddress/:id").get(verifyjwt, getAddress);

// Get default address
router.route("/getdefaultaddress").get(verifyjwt, getDefaultAddress);

// Create new address
router.route("/createaddress").post(verifyjwt, createAddress);

// Update address
router.route("/updateaddress/:id").patch(verifyjwt, updateAddress);

// Delete address
router.route("/deleteaddress/:id").delete(verifyjwt, deleteAddress);

// Set address as default
router.route("/setdefaultaddress/:id").patch(verifyjwt, setDefaultAddress);

export default router;
