import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import DistributorDashboard from "./DistributorDashboard";
import SubDistributorDashboard from "./SubDistributorDashboard";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") return <AdminDashboard />;
  if (role === "distributor") return <DistributorDashboard />;
  if (role === "sub-distributor") return <SubDistributorDashboard />;

  return <p>No dashboard access</p>;
};

export default Dashboard;
