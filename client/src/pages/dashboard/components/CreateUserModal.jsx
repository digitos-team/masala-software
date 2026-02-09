import React from "react";
import CommonModal from "../../../components/CommonModal";
import DistributorForm from "./DistributorForm";
import { registerUser } from "../../../api/auth/auth.api";
import { toast } from "react-toastify";

/**
 * 👤 CREATE USER MODAL
 * A wrapper that integrates CommonModal and DistributorForm for quick user creation.
 */
const CreateUserModal = ({ isOpen, onClose, role, onSuccess }) => {
    const handleFormSubmit = async (formData) => {
        try {
            // Ensure the correct role is passed to the backend
            const userData = {
                ...formData,
                role: role === "distributor" ? "distributor" : "retailer", // "retailer" is the role for sub-distributor in backend
            };

            await registerUser(userData);
            toast.success(`${role === "distributor" ? "Distributor" : "Sub-Distributor"} added successfully!`);
            if (onSuccess) onSuccess();
            onClose();

            // Optional: Refresh data or trigger a callback to parent if needed
            // window.location.reload(); // Simple refresh for now if needed, or better use a state update
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error(error.response?.data?.message || `Failed to add ${role}`);
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Add New ${role === "distributor" ? "Distributor" : "Sub-Distributor"}`}
        >
            <DistributorForm
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                isModal={true}
            />
        </CommonModal>
    );
};

export default CreateUserModal;
