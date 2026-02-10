import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  pricing: {
    admin: {
      costPrice: Number,
      mrp: Number
    },
    distributor: {
      price: Number
    },
    sub_distributor: {
      price: Number
    }
  },
  taxpercentage: {
    type: Number,
    required: true,
    default: 5
  },
  stock: {
    type: Number,
    required: true
  },
  minStockAlert: {
    type: Number,
    required: true,
    default: 10
  },
  unit: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

const Product = mongoose.model("Product", ProductSchema)

export { Product }
