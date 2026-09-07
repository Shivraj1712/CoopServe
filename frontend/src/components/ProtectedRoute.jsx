import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard
    if (user.role === "CUSTOMER") return <Navigate to="/customer" replace />;
    if (user.role === "WORKER") return <Navigate to="/worker" replace />;
    if (user.role === "FEDERATION_ADMIN") return <Navigate to="/admin" replace />;
  }

  return children;
}
