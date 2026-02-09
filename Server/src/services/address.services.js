import { Address } from "../models/address.models.js";
import { ApiError } from "../utils/ApiError.js";

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Create a new address
 */
const CreateAddressService = async (addressData, userId) => {
    const { name, phone, addressline, city, state, pincode, isDefault } = addressData;

    // Validation
    if (!name || !phone || !addressline || !city || !state || !pincode) {
        throw new ApiError(400, "Name, phone, address line, city, state, and pincode are required");
    }

    // If this is set as default, unset other default addresses for this user
    if (isDefault) {
        await Address.updateMany(
            { userId, isDefault: true },
            { $set: { isDefault: false } }
        );
    }

    // Create address
    const address = await Address.create({
        userId,
        name,
        phone,
        addressline,
        city,
        state,
        pincode,
        isDefault: isDefault || false
    });

    return address;
};

/**
 * Get address by ID
 */
const GetAddressByIdService = async (addressId, userRole, userId) => {
    const address = await Address.findById(addressId)
        .populate("userId", "name email");

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // Role-based access: non-admin users can only see their own addresses
    if (userRole !== "admin" && address.userId._id.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to view this address");
    }

    return address;
};

/**
 * Update address by ID
 */
const UpdateAddressService = async (addressId, updateData, userId, userRole) => {
    const address = await Address.findById(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // Verify ownership for non-admin users
    if (userRole !== "admin" && address.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to modify this address");
    }

    // If updating to default, unset other default addresses
    if (updateData.isDefault === true) {
        await Address.updateMany(
            { userId: address.userId, _id: { $ne: addressId }, isDefault: true },
            { $set: { isDefault: false } }
        );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate("userId", "name email");

    return updatedAddress;
};

/**
 * Delete address by ID
 */
const DeleteAddressService = async (addressId, userId, userRole) => {
    const address = await Address.findById(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // Verify ownership for non-admin users
    if (userRole !== "admin" && address.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to delete this address");
    }

    await Address.findByIdAndDelete(addressId);
    return { message: "Address deleted successfully" };
};

// ============================================================================
// QUERY OPERATIONS
// ============================================================================

/**
 * Get user's addresses
 */
const GetUserAddressesService = async (userId) => {
    const addresses = await Address.find({ userId })
        .sort({ isDefault: -1, createdAt: -1 })
        .populate("userId", "name email");

    return addresses;
};

/**
 * Get user's default address
 */
const GetDefaultAddressService = async (userId) => {
    const address = await Address.findOne({ userId, isDefault: true })
        .populate("userId", "name email");

    if (!address) {
        throw new ApiError(404, "No default address found");
    }

    return address;
};



// ============================================================================
// ADDRESS MANAGEMENT
// ============================================================================

/**
 * Set address as default
 */
const SetDefaultAddressService = async (addressId, userId, userRole) => {
    const address = await Address.findById(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // Verify ownership for non-admin users
    if (userRole !== "admin" && address.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You don't have permission to modify this address");
    }

    // Unset all other default addresses for this user
    await Address.updateMany(
        { userId: address.userId, isDefault: true },
        { $set: { isDefault: false } }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return address;
};





// ============================================================================
// EXPORTS
// ============================================================================

export {
    CreateAddressService,
    GetAddressByIdService,
    UpdateAddressService,
    DeleteAddressService,
    GetUserAddressesService,
    GetDefaultAddressService,
    SetDefaultAddressService
};
