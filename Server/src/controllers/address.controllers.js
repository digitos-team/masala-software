import {
    CreateAddressService,
    GetAddressByIdService,
    UpdateAddressService,
    DeleteAddressService,
    GetUserAddressesService,
    GetDefaultAddressService,
    SetDefaultAddressService
} from "../services/address.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ============================================================================
// CRUD CONTROLLERS
// ============================================================================

/**
 * Create a new address
 * @route POST /api/addresses
 * @access Authenticated users
 */
const createAddress = asyncHandler(async (req, res) => {
    const address = await CreateAddressService(req.body, req.user._id);

    return res.status(201).json(
        new ApiResponse(201, address, "Address created successfully")
    );
});

/**
 * Get single address by ID
 * @route GET /api/addresses/:id
 * @access Authenticated users (own addresses) / Admin (all)
 */
const getAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user._id;

    const address = await GetAddressByIdService(id, userRole, userId);

    return res.status(200).json(
        new ApiResponse(200, address, "Address retrieved successfully")
    );
});



/**
 * Update address by ID
 * @route PUT /api/addresses/:id
 * @access Authenticated users (own addresses)
 */
const updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const address = await UpdateAddressService(id, req.body, userId, userRole);

    return res.status(200).json(
        new ApiResponse(200, address, "Address updated successfully")
    );
});

/**
 * Delete address by ID
 * @route DELETE /api/addresses/:id
 * @access Authenticated users (own addresses)
 */
const deleteAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const result = await DeleteAddressService(id, userId, userRole);

    return res.status(200).json(
        new ApiResponse(200, result, "Address deleted successfully")
    );
});

// ============================================================================
// USER ADDRESS CONTROLLERS
// ============================================================================

/**
 * Get current user's addresses
 * @route GET /api/addresses/user
 * @access Authenticated users
 */
const getUserAddresses = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const addresses = await GetUserAddressesService(userId);

    return res.status(200).json(
        new ApiResponse(200, addresses, "User addresses retrieved successfully")
    );
});

/**
 * Get user's default address
 * @route GET /api/addresses/default
 * @access Authenticated users
 */
const getDefaultAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const address = await GetDefaultAddressService(userId);

    return res.status(200).json(
        new ApiResponse(200, address, "Default address retrieved successfully")
    );
});



// ============================================================================
// ADDRESS MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * Set address as default
 * @route PATCH /api/addresses/:id/set-default
 * @access Authenticated users
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const address = await SetDefaultAddressService(id, userId, userRole);

    return res.status(200).json(
        new ApiResponse(200, address, "Address set as default successfully")
    );
});





// ============================================================================
// EXPORTS
// ============================================================================

export {
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    getUserAddresses,
    getDefaultAddress,
    setDefaultAddress
};
