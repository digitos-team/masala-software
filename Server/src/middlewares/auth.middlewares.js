import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"

const verifyjwt = async (req, _, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(404, "Token Not Found")
        }
        const decodeInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodeInfo) {
            throw new ApiError(500, "Error While Decoding the Token")
        }

        const user = await User.findById(decodeInfo._id)
        if (!user) {
            throw new ApiError(404, "User Not Found")
        }

        req.user = user
        next()
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid Access Token"))
    }
}

const isAdmin = async (req, _, next) => {
    if (req.user.role !== "admin") {
        throw new ApiError(401, "You cannot Access this role is for admin")
    }
    next()
}

const isDistributor = async (req, _, next) => {
    if (req.user.role !== "distributor") {
        throw new ApiError(401, "You cannot Access this role is for distributor")
    }
    next()
}

const isSubDistributor = async (req, _, next) => {
    if (req.user.role !== "retailer") {
        throw new ApiError(401, "You cannot Access this role is for retailer")
    }
    next()
}

export { verifyjwt, isAdmin, isDistributor, isSubDistributor }