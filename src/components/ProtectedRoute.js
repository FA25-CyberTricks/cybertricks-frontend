// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, user, accessToken } = useAuth();
  const location = useLocation();

  // 1) Đang bootstrap/refresh -> chưa biết trạng thái => chờ
  if (loading) {
    return <div style={{ padding: 40 }}>Đang kiểm tra phiên đăng nhập…</div>;
  }

  // 2) Đã biết chắc chắn: nếu chưa đăng nhập -> về login kèm returnUrl
  const isAuthenticated = !!accessToken && !!user;
  if (!isAuthenticated) {
    const search = new URLSearchParams({ returnUrl: location.pathname + location.search }).toString();
    return <Navigate to={`/login?${search}`} replace />;
  }

  // 3) Hợp lệ -> render content
  return children;
}
