import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    //Order By Details
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderByRole: {
        type: String,
        required: true
    },

    //Invoice Details and Order details
    Orderno: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    //Distributor And Sub Distributor Details
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subDistributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    //Products Details Array
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            quantity: Number,
            unitPrice: Number,
            taxPercentage: Number,
            taxAmount: Number,
            totalPrice: Number
        }
    ],

    //Pricing Details
    pricing: {
        subTotal: {
            type: Number,
            required: true
        },
        taxAmount: {
            type: Number,
            default: 0
        },
        discountAmount: {
            type: Number,
            default: 0
        },
        shippingCharge: {
            type: Number,
            default: 0
        },
        grandTotal: {
            type: Number,
            required: true
        }
    },
    //Delivery Details
    delivery: {
        address: {
            type: String,
            required: true
        },
        expectedDate: {
            type: Date
        },
        deliveredAt: {
            type: Date
        },
        transporterName: {
            type: String
        },
        trackingNumber: {
            type: String
        }
    },
    //Order Status
    status: {
        type: String,
        enum: ["placed", "confirmed", "shipped", "delivered", "cancelled", "returned"],
        default: "placed"
    },
    //Cancellation Details
    isCancelled: {
        type: Boolean,
        default: false
    },
    cancelReason: {
        type: String
    },
    cancelledAt: {
        type: Date
    },

    //Returns Details
    isReturned: {
        type: Boolean,
        default: false
    },
    returnReason: {
        type: String
    },
    returnedAt: {
        type: Date
    }
}, { timestamps: true })

export const Order = mongoose.model("Order", OrderSchema)