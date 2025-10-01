import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * @param {children} component con (page thật sự cần bảo vệ)
 * @param {roles} optional - mảng roles được phép (["Admin", "User"])
 */
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();      // user lấy từ AuthContext
  const location = useLocation();  // path hiện tại để redirect lại sau login

  // ❌ Nếu chưa login → redirect về login, kèm returnUrl
  if (!user) {
    return <Navigate to={`/login?returnUrl=${location.pathname}`} replace />;
  }

  // ❌ Nếu có yêu cầu role mà user không có → redirect về trang báo lỗi
  if (roles && !roles.some(r => user.roles?.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Nếu pass hết → render trang thật
  return children;
}
