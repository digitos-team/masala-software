import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"

const verifyjwt = async (req, _, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided")
        }
        const decodeInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodeInfo) {
            throw new ApiError(401, "Unauthorized: Invalid token")
        }

        const user = await User.findById(decodeInfo._id)
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        req.user = user
        next()
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid Access Token"))
    }
}

const isAdmin = async (req, _, next) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Forbidden: Admin access required")
    }
    next()
}

const isDistributor = async (req, _, next) => {
    if (req.user.role !== "distributor") {
        throw new ApiError(403, "Forbidden: Distributor access required")
    }
    next()
}

const isRetailer = async (req, _, next) => {
    if (req.user.role !== "retailer") {
        throw new ApiError(403, "Forbidden: Retailer access required")
    }
    next()
}

/**
 * Flexible role checker - allows multiple roles
 * @param {Array<string>} allowedRoles - Array of allowed roles
 */
const checkRole = (allowedRoles) => {
    return async (req, _, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, `Forbidden: Access restricted to ${allowedRoles.join(", ")} only`)
        }
        next()
    }
}

// Legacy alias for backward compatibility
const isSubDistributor = isRetailer

export { verifyjwt, isAdmin, isDistributor, isRetailer, isSubDistributor, checkRole }
