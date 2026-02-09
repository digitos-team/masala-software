import mongoose from "mongoose";

const PaymentSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ["UPI", "Cash", "Card", "Net Banking", "Wallet", "Other"]
    },
    Paymentstatus: {
        type: String,
        required: true,
        enum: ["Pending","Partially_Paid", "Completed", "Failed", "Refunded"]
    },
    transactionId: {
        type: String,
        required: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export const Payment = mongoose.model("Payment", PaymentSchema)
