import {
  RegisterUserService,
  LoginUserService,
  LogoutUserService,
  GetDistributorsService,
  GetRetailersService,
  DeleteUserService,
  UpdateUserService,
  UpdatePasswordService
} from "../services/user.services.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const options = {
  httpOnly: true,
  secure: true
}

const registerUser = asyncHandler(async (req, res) => {
  const user = await RegisterUserService(req.body);

  return res.status(201).json(
    new ApiResponse(200, user, "User registered successfully")
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken } = await LoginUserService(email, password);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken
        },
        "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  console.log(`controller ${req.user}`);

  await LogoutUserService(req.user._id)
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const getDistributors = asyncHandler(async (req, res) => {
  const distributors = await GetDistributorsService();
  return res.status(200).json(
    new ApiResponse(200, distributors, "Distributors fetched successfully")
  );
});

const getRetailers = asyncHandler(async (req, res) => {
  const retailers = await GetRetailersService();
  return res.status(200).json(
    new ApiResponse(200, retailers, "Retailers fetched successfully")
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await DeleteUserService(id);
  return res.status(200).json(
    new ApiResponse(200, result, "User deleted successfully")
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await UpdateUserService(id, req.body);
  return res.status(200).json(
    new ApiResponse(200, updatedUser, "User updated successfully")
  );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json(
      new ApiResponse(400, null, "Password is required")
    );
  }

  const result = await UpdatePasswordService(id, password);
  return res.status(200).json(
    new ApiResponse(200, result, "Password updated successfully")
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getDistributors,
  getRetailers,
  deleteUser,
  updateUser,
  updatePassword
}