import React, { useState, useRef } from "react";
import CommonModal from "../../../components/CommonModal";
import { updatePassword } from "../../../api/auth/auth.api";
import { toast } from "react-toastify";

/**
 * 🔑 PASSWORD RESET MODAL
 * Allows admin to reset a user's password
 */
const ResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const isSubmitting = useRef(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting.current) {
            console.log("⚠️ Submission already in progress, ignoring...");
            return;
        }

        console.log("🔐 Password Reset - Starting submission...");
        console.log("User ID:", user?._id);
        console.log("Password length:", password?.length);

        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            isSubmitting.current = true;
            setLoading(true);
            console.log("🚀 Calling updatePassword API...");
            console.log("API Endpoint: /users/update-password/" + user._id);

            const result = await updatePassword(user._id, password);

            console.log("✅ API Response:", result);
            toast.success("Password updated successfully!");
            setPassword("");
            setConfirmPassword("");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Error updating password:", error);
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            console.error("Error status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Reset Password for ${user?.name || "User"}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Enter new password"
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Confirm new password"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-5 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-3 border border-slate-300 text-slate-600 text-sm font-black rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </CommonModal>
    );
};

export default ResetPasswordModal;
