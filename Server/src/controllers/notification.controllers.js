import {
    CreateNotificationService,
    GetNotificationByIdService,
    UpdateNotificationService,
    DeleteNotificationService,
    GetAllNotificationsService,
    GetUserNotificationsService,
    GetUnreadNotificationsService,
    SearchNotificationsService,
    MarkAsReadService,
    MarkAllAsReadService,
    GetNotificationStatsService,
    BulkMarkAsReadService,
    BulkDeleteNotificationsService
} from "../services/notification.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ============================================================================
// CRUD CONTROLLERS
// ============================================================================

/**
 * Create a new notification
 * @route POST /api/notifications
 * @access Admin only
 */
const createNotification = asyncHandler(async (req, res) => {
    const notification = await CreateNotificationService(req.body);

    return res.status(201).json(
        new ApiResponse(201, notification, "Notification created successfully")
    );
});

/**
 * Get single notification by ID
 * @route GET /api/notifications/:id
 * @access Authenticated users (own notifications) / Admin (all)
 */
const getNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user._id;

    const notification = await GetNotificationByIdService(id, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification retrieved successfully")
    );
});

/**
 * Get all notifications with filters and pagination
 * @route GET /api/notifications
 * @access Authenticated users
 */
const getAllNotifications = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user._id;

    const result = await GetAllNotificationsService(req.query, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, result, "Notifications retrieved successfully")
    );
});

/**
 * Update notification by ID
 * @route PUT /api/notifications/:id
 * @access Admin only
 */
const updateNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const notification = await UpdateNotificationService(id, req.body);

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification updated successfully")
    );
});

/**
 * Delete notification by ID
 * @route DELETE /api/notifications/:id
 * @access Admin only
 */
const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await DeleteNotificationService(id);

    return res.status(200).json(
        new ApiResponse(200, result, "Notification deleted successfully")
    );
});

// ============================================================================
// USER NOTIFICATION CONTROLLERS
// ============================================================================

/**
 * Get current user's notifications
 * @route GET /api/notifications/user
 * @access Authenticated users
 */
const getUserNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const filters = {
        type: req.query.type,
        isRead: req.query.isRead
    };

    const notifications = await GetUserNotificationsService(userId, filters);

    return res.status(200).json(
        new ApiResponse(200, notifications, "User notifications retrieved successfully")
    );
});

/**
 * Get unread notifications for current user
 * @route GET /api/notifications/unread
 * @access Authenticated users
 */
const getUnreadNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await GetUnreadNotificationsService(userId);

    return res.status(200).json(
        new ApiResponse(200, notifications, "Unread notifications retrieved successfully")
    );
});

/**
 * Search notifications
 * @route POST /api/notifications/search
 * @access Authenticated users
 */
const searchNotifications = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;
    const userRole = req.user.role;
    const userId = req.user._id;

    const notifications = await SearchNotificationsService(searchTerm, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, notifications, "Search completed successfully")
    );
});

// ============================================================================
// NOTIFICATION MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * Mark notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Authenticated users
 */
const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const notification = await MarkAsReadService(id, userId, userRole);

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});

/**
 * Mark all notifications as read for current user
 * @route PATCH /api/notifications/mark-all-read
 * @access Authenticated users
 */
const markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await MarkAllAsReadService(userId);

    return res.status(200).json(
        new ApiResponse(200, result, result.message)
    );
});

/**
 * Get notification statistics
 * @route GET /api/notifications/stats
 * @access Authenticated users
 */
const getNotificationStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    const stats = await GetNotificationStatsService(userId, userRole);

    return res.status(200).json(
        new ApiResponse(200, stats, "Statistics retrieved successfully")
    );
});

// ============================================================================
// BULK OPERATION CONTROLLERS
// ============================================================================



/**
 * Bulk mark as read
 * @route PATCH /api/notifications/bulk/read
 * @access Authenticated users
 */
const bulkMarkAsRead = asyncHandler(async (req, res) => {
    const { notificationIds } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const result = await BulkMarkAsReadService(notificationIds, userId, userRole);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully marked ${result.results.length} notifications as read`
        )
    );
});

/**
 * Bulk delete notifications
 * @route DELETE /api/notifications/bulk
 * @access Admin only
 */
const bulkDeleteNotifications = asyncHandler(async (req, res) => {
    const { notificationIds } = req.body;

    const result = await BulkDeleteNotificationsService(notificationIds);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            `Successfully deleted ${result.deletedCount} out of ${result.requestedCount} notifications`
        )
    );
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
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
};
