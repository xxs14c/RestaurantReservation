import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;