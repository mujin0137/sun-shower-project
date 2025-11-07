import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // 로딩 중
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <CircularProgress sx={{ color: "#A3D8F4" }} />
      </Box>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
