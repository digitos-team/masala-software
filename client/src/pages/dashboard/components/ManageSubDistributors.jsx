import { useState, useEffect } from "react";
import SubDistributorTable from "./SubDistributorTable";
import CreateUserModal from "./CreateUserModal";
import { getSubDistributors } from "../../../api/auth/auth.api";
import { toast } from "react-toastify";

const ManageSubDistributors = () => {
    const [subDistributors, setSubDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchSubDistributors = async () => {
        try {
            setLoading(true);
            const response = await getSubDistributors();
            setSubDistributors(response.data || []);
        } catch (error) {
            console.error("Failed to fetch sub-distributors", error);
            toast.error("Failed to load sub-distributors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubDistributors();
    }, []);

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchSubDistributors();
    };

    /* ================= RENDER ================= */
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-800">
                    Manage Sub-Distributors
                </h1>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    + Add Sub-Distributor
                </button>
            </div>

            {/* TABLE */}
            {loading ? (
                <div className="text-center py-10 text-slate-400 font-semibold">Loading sub-distributors...</div>
            ) : (
                <SubDistributorTable
                    subDistributors={subDistributors}
                    onEdit={(sub) => console.log("Edit", sub)}
                    onDelete={(id) => console.log("Delete", id)}
                />
            )}

            {/* CREATE MODAL */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                role="retailer"
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default ManageSubDistributors;
