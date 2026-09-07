import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  TextField,
  Divider,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import NotificationToast from "./NotificationToast";

export default function ProfileView() {
  const { user, login } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState(0);

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email] = useState(user?.email || "");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Loading & Toast State
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const getRoleLabel = (role) => {
    switch (role) {
      case "FEDERATION_ADMIN":
        return "Federation Executive Admin";
      case "WORKER":
        return "Verified Cooperative Worker";
      default:
        return "Customer Account";
    }
  };

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

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ open: true, message: "Name cannot be empty", severity: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { name, phone });
      setToast({ open: true, message: "Profile details updated successfully!", severity: "success" });

      // Update AuthContext user state by calling login token refresh or local storage update
      const storedToken = localStorage.getItem("token");
      if (storedToken && res.data.user) {
        login(storedToken, res.data.user);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.error || "Failed to update profile",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setToast({ open: true, message: "New password must be at least 6 characters long", severity: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ open: true, message: "New passwords do not match", severity: "error" });
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put("/auth/profile", { password: newPassword });
      setToast({ open: true, message: "Password updated successfully! Use your new password on next sign in.", severity: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.error || "Failed to update password",
        severity: "error"
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 6 }}>
      {/* Top Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          mb: 4,
          bgcolor: "#0F172A",
          color: "#FFFFFF",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.1)"
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Avatar
              sx={{
                bgcolor: "#2563EB",
                width: { xs: 72, sm: 88 },
                height: { xs: 72, sm: 88 },
                fontSize: { xs: 32, sm: 40 },
                fontWeight: 800,
                border: "4px solid #FFFFFF",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
              }}
            >
              {user.name?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
              <Typography variant="h4" fontWeight={800} color="#FFFFFF" letterSpacing="-0.5px" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                {user.name}
              </Typography>
              <Chip
                icon={<VerifiedIcon style={{ color: "#10B981" }} />}
                label={getRoleLabel(user.role)}
                color={getRoleColor(user.role)}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#94A3B8", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <span>✉️ {user.email}</span>
              <span>📞 {user.phone || "+91 9876543210"}</span>
              <span>🆔 MEM-GJ-2026-{user.id?.substring(0, 6).toUpperCase()}</span>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Responsive Grid Layout */}
      <Grid container spacing={4}>
        {/* Left Column: Quick Profile Summary & Security Status */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} color="#0F172A" sx={{ mb: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Account & Security Status
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <ShieldCheckIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Identity Verification</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#0F172A">Govt Aadhaar & GSTIN Verified</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AccountBalanceIcon color="secondary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Federation Association</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#0F172A">Gujarat Labour Co-op Fed</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <BadgeIcon color="success" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Member Standing</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#10B981">Active Member in Good Standing</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Editable Profile Sections with Tabs */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 3, overflow: "hidden" }}>
            {/* Tabs Header */}
            <Box sx={{ borderBottom: "1px solid #E2E8F0", bgcolor: "#F8FAFC", px: 2 }}>
              <Tabs
                value={activeSubTab}
                onChange={(e, val) => setActiveSubTab(val)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Details" sx={{ fontWeight: 700, textTransform: "none" }} />
                <Tab icon={<LockIcon />} iconPosition="start" label="Security & Password" sx={{ fontWeight: 700, textTransform: "none" }} />
              </Tabs>
            </Box>

            {/* TAB 0: Personal Details Form */}
            {activeSubTab === 0 && (
              <Box component="form" onSubmit={handleUpdateDetails} sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" fontWeight={800} color="#0F172A" gutterBottom>
                  Update Personal & Contact Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Keep your account profile details updated for seamless cooperative bookings and notifications.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={email}
                      disabled
                      helperText="Email address is fixed to your verified account identity"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="disabled" fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Role"
                      value={getRoleLabel(user.role)}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cooperative Member ID"
                      value={`MEM-GJ-2026-${user.id?.substring(0, 6).toUpperCase()}`}
                      disabled
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={saving}
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: 2.5, px: 4, fontWeight: 700 }}
                  >
                    {saving ? "Saving Changes..." : "Save Profile Details"}
                  </Button>
                </Box>
              </Box>
            )}

            {/* TAB 1: Change Password Form */}
            {activeSubTab === 1 && (
              <Box component="form" onSubmit={handleUpdatePassword} sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" fontWeight={800} color="#0F172A" gutterBottom>
                  Security & Password Credentials
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Update your account password to maintain maximum account security.
                </Typography>

                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Password must contain at least 6 characters. Ensure you keep your login credentials safe.
                </Alert>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter new password (min 6 chars)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Re-enter new password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={passwordSaving}
                    startIcon={<LockIcon />}
                    sx={{ borderRadius: 2.5, px: 4, fontWeight: 700 }}
                  >
                    {passwordSaving ? "Updating Password..." : "Update Password"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Toast Notification */}
      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
