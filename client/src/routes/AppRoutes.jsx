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
import RetailerOrders from "../pages/orders/RetailerOrders";
import RetailerOrderDetails from "../pages/orders/RetailerOrderDetails";

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

              {/* Business Operations (Shared) */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "distributor", "retailer"]} />}>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/create" element={<CreateOrder />} />
                <Route path="/orders/edit/:id" element={<CreateOrder />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Admin and Distributor Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "distributor"]} />}>
                <Route path="/manage-sub-distributors" element={<ManageSubDistributors />} />
                <Route path="/retailer-orders" element={<RetailerOrders />} />
                <Route path="/retailer-order-details/:id" element={<RetailerOrderDetails />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>

              {/* Retailer Dashboard Route */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "retailer"]} />}>
                <Route path="/subdistributor-dashboard" element={<SubDistributorDashboard />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/distributor-dashboard" element={<DistributorDashboard />} />
                <Route path="/manage-distributors" element={<ManageDistributors />} />
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
