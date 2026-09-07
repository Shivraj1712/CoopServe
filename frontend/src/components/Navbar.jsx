import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide global navbar on dashboard routes to prevent double-header stacking
  const isDashboardRoute =
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/worker") ||
    location.pathname.startsWith("/admin");

  if (isDashboardRoute) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case "FEDERATION_ADMIN":
        return "secondary";
      case "WORKER":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Brand Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
          onClick={() => {
            if (user) {
              if (user.role === "CUSTOMER") navigate("/customer");
              else if (user.role === "WORKER") navigate("/worker");
              else if (user.role === "FEDERATION_ADMIN") navigate("/admin");
            } else {
              navigate("/login");
            }
          }}
        >
          <Avatar sx={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)", width: 44, height: 44 }}>
            <HandshakeIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: "#0D47A1", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              CoopServe
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block" }}>
              Labour Cooperative Network
            </Typography>
          </Box>
        </Box>

        {/* User Navigation Controls */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <Chip
              icon={<ShieldCheckIcon fontSize="small" />}
              label={user.role === "FEDERATION_ADMIN" ? "Federation Admin" : user.role === "WORKER" ? "Verified Worker" : "Customer Portal"}
              color={getRoleColor(user.role)}
              size="medium"
              sx={{ px: 1, fontWeight: 700, display: { xs: "none", sm: "inline-flex" } }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "#0D47A1", width: 36, height: 36, fontWeight: 700 }}>
                {user.name?.[0]}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", display: { xs: "none", sm: "block" } }}>
                {user.name}
              </Typography>
            </Box>

            <IconButton color="error" onClick={logout} title="Sign Out">
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

