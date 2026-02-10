import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/users.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import notificationRouter from "./routes/notification.routes.js"
import addressRouter from "./routes/address.routes.js"
import subDistributorRouter from "./routes/subDistributor.routes.js"

export const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/addresses", addressRouter)
app.use("/api/sub-distributor", subDistributorRouter)


