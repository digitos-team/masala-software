import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const generateAccessToken = async (user_id) => {
    const user = await User.findById(user_id)
    if (!user) throw new ApiError(404, "User Not Found")
    const accessToken = user.generateAccessToken()
    return accessToken
}

const RegisterUserService = async ({ name, email, password, role, ...rest }) => {
    if (!email) throw new ApiError(400, "Email or Phone is required")

    if (!password) throw new ApiError(400, "Password is required")
    const existingUser = await User.findOne({ email })
    if (existingUser) throw new ApiError(400, "User Already Exists")
    const user = await User.create({ name, email, password, role, ...rest })
    return user
}

const LoginUserService = async (email, password) => {
    if (!email) throw new ApiError(400, "Email or Phone is required")
    if (!password) throw new ApiError(400, "Password is required")

    const user = await User.findOne({ email })
    if (!user) throw new ApiError(404, "User Not Found")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(401, "Invalid Password")

    const accessToken = await generateAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    return { user: loggedInUser, accessToken }
}


const LogoutUserService = async (user_id) => {
    await User.findByIdAndUpdate(
        user_id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    return true
}

const GetDistributorsService = async () => {
    const distributors = await User.find({ role: "distributor" }).select("-password");
    return distributors;
}

const GetRetailersService = async () => {
    const retailers = await User.find({ role: "retailer" }).select("-password").populate("parentDistributor", "name email");
    return retailers;
}

export {
    RegisterUserService,
    LoginUserService,
    LogoutUserService,
    GetDistributorsService,
    GetRetailersService
}