import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Switch,
  FormControlLabel
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import NotificationToast from "./NotificationToast";

export default function AccountSecurityView() {
  const { user, updateUser } = useAuth();

  // Profile Details Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Security Toggles State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Notification Toast State
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ open: true, message: "Name cannot be empty", severity: "error" });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put("/auth/profile", { name, phone });
      setToast({ open: true, message: "Account profile details updated successfully!", severity: "success" });

      if (res.data.user && updateUser) {
        updateUser(res.data.user);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.error || "Failed to update account details",
        severity: "error"
      });
    } finally {
      setSavingProfile(false);
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

    setSavingPassword(true);
    try {
      await api.put("/auth/profile", { password: newPassword });
      setToast({ open: true, message: "Security password updated successfully!", severity: "success" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.error || "Failed to update password",
        severity: "error"
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Header */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SecurityIcon sx={{ fontSize: 44, color: "#38BDF8" }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="#FFFFFF">
              Account Settings & Security Center
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Update your account details, manage login credentials, and configure security preferences.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Security Preferences & Status */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={800} color="#0F172A" sx={{ mb: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Security Preferences
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#0F172A">
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Secure logins with SMS/Email OTP verification.
                    </Typography>
                  </Box>
                }
              />

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#0F172A">
                      Unrecognized Device Alerts
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Get real-time alerts when signed in on new devices.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: "0.825rem" }}>
              Keep your contact details up to date so you can receive critical account recovery alerts.
            </Alert>
          </Paper>
        </Grid>

        {/* Right Column: Edit Details & Password */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Form 1: Account Details */}
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={800} color="#0F172A" gutterBottom>
                Edit Account Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your primary contact information.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Box component="form" onSubmit={handleUpdateProfile}>
                <Grid container spacing={2.5}>
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
                      value={user.email || ""}
                      disabled
                      helperText="Contact support to update primary account email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="disabled" fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={savingProfile}
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: 1.5, px: 3, fontWeight: 700 }}
                  >
                    {savingProfile ? "Saving..." : "Save Account Details"}
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Form 2: Password Update */}
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={800} color="#0F172A" gutterBottom>
                Change Security Password
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your login password regularly to maintain account security.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Box component="form" onSubmit={handleUpdatePassword}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Min 6 characters"
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Re-enter password"
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

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={savingPassword}
                    startIcon={<LockIcon />}
                    sx={{ borderRadius: 1.5, px: 3, fontWeight: 700 }}
                  >
                    {savingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}

