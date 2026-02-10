import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Products from "../pages/products/Products";
import AppLayout from "../layout/AppLayout";
import Orders from "../pages/orders/Orders";
import CreateOrder from "../pages/orders/CreateOrder";
import OrderDetails from "../pages/orders/OrderDetails";
import Reports from "../pages/reports/Reports";
import Dashboard from "../pages/dashboard/Dashboard";
import DistributorDashboard from "../pages/dashboard/DistributorDashboard";
import SubDistributorDashboard from "../features/sub-distributor/SubDistributorDashboard";
import Register from "../pages/auth/Register";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ManageDistributors from "../pages/dashboard/components/ManageDistributors";
import ManageSubDistributors from "../pages/dashboard/components/ManageSubDistributors";
import Analytics from "../pages/dashboard/Analytics";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Common routes for all authenticated users */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Retailer (Sub-Distributor) Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={["retailer"]} />}>
                <Route path="/subdistributor-dashboard" element={<SubDistributorDashboard />} />
              </Route>


              {/* Admin and Distributor Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "distributor"]} />}>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/create" element={<CreateOrder />} />
                <Route path="/orders/edit/:id" element={<CreateOrder />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/distributor-dashboard" element={<DistributorDashboard />} />
                <Route path="/subdistributor-dashboard" element={<SubDistributorDashboard />} />
                <Route path="/manage-distributors" element={<ManageDistributors />} />
                <Route path="/manage-sub-distributors" element={<ManageSubDistributors />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
