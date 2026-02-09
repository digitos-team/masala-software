import { DB_NAME } from "../constant.js";
import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
       const connection =  await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`)
       console.log(`Databse is connnected to ${DB_NAME} Hosted By ${connection.connection.host}`)
    } catch (error) {
        console.log("Mongoose connection error",error)
        process.exit(1)
        
    }
}
