import mongoose from "mongoose";

const SalesReportSchema = mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    distributorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    subDistributorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    totalOrders:{
        type:Number,
        required:true
    },
    totalSales:{
        type:Number,
        required:true
    },
    totalTax:{
        type:Number,
        required:true
    },
    totalProfit:{
        type:Number,
        required:true
    }
    
},{timestamps:true})

export const SalesReport = mongoose.model("SalesReport",SalesReportSchema)