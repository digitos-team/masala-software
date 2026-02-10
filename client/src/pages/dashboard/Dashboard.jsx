import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import DistributorDashboard from "./DistributorDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  // Redirect retailers to their own dashboard
  if (role === "retailer") {
    return <Navigate to="/subdistributor-dashboard" replace />;
  }

  if (role === "admin") return <AdminDashboard />;
  if (role === "distributor") return <DistributorDashboard />;

  return <p>No dashboard access</p>;
};

export default Dashboard;
