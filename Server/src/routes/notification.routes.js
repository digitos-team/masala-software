import express from "express";
import {
    createNotification,
    getNotification,
    getAllNotifications,
    updateNotification,
    deleteNotification,
    getUserNotifications,
    getUnreadNotifications,
    searchNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationStats,
    bulkMarkAsRead,
    bulkDeleteNotifications
} from "../controllers/notification.controllers.js";
import { verifyjwt, isAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// ============================================================================
// AUTHENTICATED USER ROUTES
// Users can access their own notifications
// ============================================================================

// Get all notifications (filtered by user for non-admin)
router.route("/getallnotifications").get(verifyjwt, getAllNotifications);

// Get single notification by ID
router.route("/getnotification/:id").get(verifyjwt, getNotification);

// Get current user's notifications
router.route("/getusernotifications").get(verifyjwt, getUserNotifications);

// Get unread notifications
router.route("/getunreadnotifications").get(verifyjwt, getUnreadNotifications);

// Search notifications
router.route("/searchnotifications").post(verifyjwt, searchNotifications);

// Mark notification as read
router.route("/markasread/:id").patch(verifyjwt, markAsRead);

// Mark all notifications as read
router.route("/markallnotificationsasread").patch(verifyjwt, markAllAsRead);

// Get notification statistics
router.route("/getnotificationstats").get(verifyjwt, getNotificationStats);

// Bulk mark as read
router.route("/bulkmarkasread").patch(verifyjwt, bulkMarkAsRead);

// ============================================================================
// ADMIN-ONLY ROUTES
// Only admin users can access these routes
// ============================================================================

// Create new notification
router.route("/createnotification").post(verifyjwt, isAdmin, createNotification);

// Update notification
router.route("/updatenotification/:id").patch(verifyjwt, isAdmin, updateNotification);

// Delete notification
router.route("/deletenotification/:id").delete(verifyjwt, isAdmin, deleteNotification);



// Bulk delete notifications
router.route("/deletenotification/bulk").delete(verifyjwt, isAdmin, bulkDeleteNotifications);

export default router;
