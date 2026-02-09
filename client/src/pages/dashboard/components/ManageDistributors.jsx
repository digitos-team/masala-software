import { useState, useEffect } from "react";
import DistributorTable from "./DistributorTable";
import CreateUserModal from "../../../pages/dashboard/components/CreateUserModal";
import { getDistributors } from "../../../api/auth/auth.api";
import { toast } from "react-toastify";

const ManageDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDistributors = async () => {
    try {
      setLoading(true);
      const response = await getDistributors();
      setDistributors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch distributors", error);
      toast.error("Failed to load distributors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchDistributors();
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">
          Manage Distributors
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          + Add Distributor
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-10 text-slate-400 font-semibold">Loading distributors...</div>
      ) : (
        <DistributorTable
          distributors={distributors}
          onEdit={(dist) => console.log("Edit", dist)} // TODO: Implement specific Edit if needed
          onDelete={(id) => console.log("Delete", id)} // TODO: Implement Delete
        />
      )}

      {/* CREATE MODAL */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        role="distributor"
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default ManageDistributors;
