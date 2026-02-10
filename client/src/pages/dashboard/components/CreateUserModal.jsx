import React from "react";
import CommonModal from "../../../components/CommonModal";
import DistributorForm from "./DistributorForm";
import { registerUser, updateUser } from "../../../api/auth/auth.api";
import { toast } from "react-toastify";

/**
 * 👤 CREATE / EDIT USER MODAL
 * A wrapper that integrates CommonModal and DistributorForm for user creation and editing.
 */
const CreateUserModal = ({ isOpen, onClose, role, onSuccess, initialData = null }) => {
    const handleFormSubmit = async (formData) => {
        try {
            // Ensure the correct role is passed to the backend
            const userData = {
                ...formData,
                role: role === "distributor" ? "distributor" : "retailer", // "retailer" is the role for sub-distributor in backend
            };

            if (initialData) {
                // UPDATE
                await updateUser(initialData._id, userData);
                toast.success(`${role === "distributor" ? "Distributor" : "Sub-Distributor"} updated successfully!`);
            } else {
                // CREATE
                await registerUser(userData);
                toast.success(`${role === "distributor" ? "Distributor" : "Sub-Distributor"} added successfully!`);
            }

            if (onSuccess) onSuccess();
            onClose();

        } catch (error) {
            console.error("Error saving user:", error);
            toast.error(error.response?.data?.message || `Failed to save ${role}`);
        }
    };

    const isEdit = !!initialData;
    const title = isEdit
        ? `Edit ${role === "distributor" ? "Distributor" : "Sub-Distributor"}`
        : `Add New ${role === "distributor" ? "Distributor" : "Sub-Distributor"}`;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <DistributorForm
                initialData={initialData}
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                isModal={true}
            />
        </CommonModal>
    );
};

export default CreateUserModal;
