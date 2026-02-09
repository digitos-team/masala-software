import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ login nahi hai → login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ login hai → page allow
  return children;
};

export default ProtectedRoute;
