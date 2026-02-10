import { useState, useEffect } from "react";
import DistributorTable from "./DistributorTable";
import CreateUserModal from "../../../pages/dashboard/components/CreateUserModal";
import ResetPasswordModal from "./ResetPasswordModal";
import { getDistributors, deleteUser } from "../../../api/auth/auth.api";
import { toast } from "react-toastify";

const ManageDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resettingUser, setResettingUser] = useState(null);

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

  /* ================= HANDLERS ================= */
  const handleEdit = (distributor) => {
    setEditingDistributor(distributor);
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this distributor? This action cannot be undone.")) {
      try {
        await deleteUser(id);
        toast.success("Distributor deleted successfully");
        fetchDistributors();
      } catch (error) {
        console.error("Failed to delete distributor", error);
        toast.error("Failed to delete distributor");
      }
    }
  };

  const handleResetPassword = (distributor) => {
    console.log("Reset password clicked for:", distributor);
    setResettingUser(distributor);
    setShowResetPasswordModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setEditingDistributor(null); // Reset editing state
    fetchDistributors();
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingDistributor(null);
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
          onClick={() => {
            setEditingDistributor(null);
            setShowCreateModal(true);
          }}
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
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
        />
      )}

      {/* CREATE / EDIT MODAL */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          role="distributor"
          onSuccess={handleCreateSuccess}
          initialData={editingDistributor}
        />
      )}

      {/* RESET PASSWORD MODAL */}
      {showResetPasswordModal && resettingUser && (
        <ResetPasswordModal
          isOpen={showResetPasswordModal}
          onClose={() => {
            setShowResetPasswordModal(false);
            setResettingUser(null);
          }}
          user={resettingUser}
          onSuccess={() => {
            setShowResetPasswordModal(false);
            setResettingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageDistributors;
