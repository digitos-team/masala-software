import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["order", "payment", "delivery", "other"],
        default: "other"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Notification = mongoose.model("Notification", NotificationSchema)