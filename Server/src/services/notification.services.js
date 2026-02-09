import { Notification } from "../models/notification.models.js";
import { ApiError } from "../utils/ApiError.js";

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Create a new notification
 */
const CreateNotificationService = async (notificationData) => {
    const { userId, title, message, type } = notificationData;

    // Validation
    if (!userId || !title || !message || !type) {
        throw new ApiError(400, "User ID, title, message, and type are required");
    }

    // Create notification
    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        isRead: false
    });

    return notification;
};

/**
 * Get notification by ID
 */
const GetNotificationByIdService = async (notificationId, userRole, userId) => {
    const notification = await Notification.findById(notificationId)
        .populate("userId", "name email");

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Role-based access: non-admin users can only see their own notifications
    if (userRole !== "admin" && notification.userId._id.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to view this notification");
    }

    return notification;
};

/**
 * Update notification by ID
 */
const UpdateNotificationService = async (notificationId, updateData) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
        notificationId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate("userId", "name email");

    return updatedNotification;
};

/**
 * Delete notification by ID
 */
const DeleteNotificationService = async (notificationId) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    await Notification.findByIdAndDelete(notificationId);
    return { message: "Notification deleted successfully" };
};

// ============================================================================
// QUERY OPERATIONS
// ============================================================================

/**
 * Get all notifications with filtering and pagination
 */
const GetAllNotificationsService = async (queryParams, userRole, userId) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        type,
        isRead
    } = queryParams;

    // Build query
    const query = {};

    // Non-admin users can only see their own notifications
    if (userRole !== "admin") {
        query.userId = userId;
    }

    // Filter by type
    if (type) {
        query.type = type;
    }

    // Filter by read status
    if (isRead !== undefined) {
        query.isRead = isRead === "true" || isRead === true;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const notifications = await Notification.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "name email");

    const totalNotifications = await Notification.countDocuments(query);

    return {
        notifications,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalNotifications / Number(limit)),
            totalNotifications,
            hasMore: skip + notifications.length < totalNotifications
        }
    };
};

/**
 * Get user's notifications
 */
const GetUserNotificationsService = async (userId, filters = {}) => {
    const query = { userId };

    // Apply filters
    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.isRead !== undefined) {
        query.isRead = filters.isRead;
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .populate("userId", "name email");

    return notifications;
};

/**
 * Get unread notifications for user
 */
const GetUnreadNotificationsService = async (userId) => {
    const notifications = await Notification.find({
        userId,
        isRead: false
    })
        .sort({ createdAt: -1 })
        .populate("userId", "name email");

    return notifications;
};

/**
 * Search notifications by title or message
 */
const SearchNotificationsService = async (searchTerm, userRole, userId) => {
    if (!searchTerm || searchTerm.trim() === "") {
        throw new ApiError(400, "Search term is required");
    }

    const query = {
        $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { message: { $regex: searchTerm, $options: "i" } }
        ]
    };

    // Non-admin users can only search their own notifications
    if (userRole !== "admin") {
        query.userId = userId;
    }

    const notifications = await Notification.find(query)
        .limit(20)
        .populate("userId", "name email");

    return notifications;
};

// ============================================================================
// NOTIFICATION MANAGEMENT
// ============================================================================

/**
 * Mark notification as read
 */
const MarkAsReadService = async (notificationId, userId, userRole) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Verify ownership for non-admin users
    if (userRole !== "admin" && notification.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to modify this notification");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
};

/**
 * Mark all user notifications as read
 */
const MarkAllAsReadService = async (userId) => {
    const result = await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
    );

    return {
        message: "All notifications marked as read",
        modifiedCount: result.modifiedCount
    };
};

/**
 * Get notification statistics
 */
const GetNotificationStatsService = async (userId, userRole) => {
    const query = userRole === "admin" ? {} : { userId };

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });
    const readCount = await Notification.countDocuments({ ...query, isRead: true });

    const notificationsByType = await Notification.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        totalNotifications,
        unreadCount,
        readCount,
        notificationsByType
    };
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================


/**
 * Bulk mark notifications as read
 */
const BulkMarkAsReadService = async (notificationIds, userId, userRole) => {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        throw new ApiError(400, "Notification IDs array is required");
    }

    const results = [];
    const errors = [];

    for (const notificationId of notificationIds) {
        try {
            const notification = await MarkAsReadService(notificationId, userId, userRole);
            results.push({
                notificationId,
                success: true
            });
        } catch (error) {
            errors.push({
                notificationId,
                success: false,
                error: error.message
            });
        }
    }

    return { results, errors };
};

/**
 * Bulk delete notifications
 */
const BulkDeleteNotificationsService = async (notificationIds) => {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        throw new ApiError(400, "Notification IDs array is required");
    }

    const result = await Notification.deleteMany({
        _id: { $in: notificationIds }
    });

    return {
        deletedCount: result.deletedCount,
        requestedCount: notificationIds.length
    };
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
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
};
