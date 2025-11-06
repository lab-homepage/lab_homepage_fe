import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 개발용 우회
  if (process.env.REACT_APP_AUTH_BYPASS === "true") return <Outlet />;

  const hasToken = !!localStorage.getItem("lab_admin_token");
  if (loading && hasToken) return null;
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location }} />
  );
}
