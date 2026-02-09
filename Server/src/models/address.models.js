import mongoose from "mongoose";

const AddressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    addressline: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Address = mongoose.model("Address", AddressSchema)