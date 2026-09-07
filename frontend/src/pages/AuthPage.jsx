import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LockResetIcon from "@mui/icons-material/LockReset";
import api from "../services/api";

export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const [role, setRole] = useState("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: Send request, 2: Reset password
  const [newPassword, setNewPassword] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotErr, setForgotErr] = useState("");

  const { user, loading: authLoading, login, register } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated user away from login page
  React.useEffect(() => {
    if (user && !authLoading) {
      if (user.role === "CUSTOMER") navigate("/customer", { replace: true });
      else if (user.role === "WORKER") navigate("/worker", { replace: true });
      else if (user.role === "FEDERATION_ADMIN") navigate("/admin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === 0) {
        const res = await login(email, password);
        redirectByRole(res.user.role);
      } else {
        const res = await register({ name, email, phone, password, role });
        redirectByRole(res.user.role);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (userRole) => {
    if (userRole === "CUSTOMER") navigate("/customer");
    else if (userRole === "WORKER") navigate("/worker");
    else if (userRole === "FEDERATION_ADMIN") navigate("/admin");
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setForgotErr("");
    setForgotMsg("");
    try {
      const res = await api.post("/auth/forgot-password", { email: forgotEmail });
      setForgotMsg(res.data.message);
      setForgotStep(2);
    } catch (err) {
      setForgotErr(err.response?.data?.error || "Failed to initiate reset");
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setForgotErr("");
    setForgotMsg("");
    try {
      const res = await api.post("/auth/reset-password", { email: forgotEmail, newPassword });
      setForgotMsg(res.data.message);
      setTimeout(() => {
        setForgotOpen(false);
        setForgotStep(1);
        setForgotEmail("");
        setNewPassword("");
        setForgotMsg("");
      }, 2000);
    } catch (err) {
      setForgotErr(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side: Production Banner */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Avatar sx={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)", width: 64, height: 64, mb: 2 }}>
              <HandshakeIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h3" sx={{ color: "#1E3A8A", fontWeight: 800, mb: 1, letterSpacing: "-1px", fontSize: { xs: "2rem", sm: "3rem" } }}>
              CoopServe
            </Typography>
            <Typography variant="h6" sx={{ color: "#2563EB", fontWeight: 800, mb: 2 }}>
              Cooperative Gig Services Network
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
              Empowering skilled gig workers under verified Labour Cooperative Federations. 
              Connecting households with background-checked electricians, plumbers, carpenters, caregivers, 
              and domestic helpers with direct 90% worker payouts and 10% co-op welfare reserve funds.
            </Typography>
          </Box>

          {/* Production Stats Banner */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={800} color="primary">
                  10,000+
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Verified Co-op Members
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={800} color="secondary">
                  ₹1.2 Cr+
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Direct Worker Disbursal
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side: Auth Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 4, bgcolor: "#FFFFFF" }}>
            <Tabs value={tab} onChange={(e, val) => setTab(val)} variant="fullWidth" sx={{ mb: 3 }}>
              <Tab label="Sign In" sx={{ fontWeight: 700 }} />
              <Tab label="Register Account" sx={{ fontWeight: 700 }} />
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              {tab === 1 && (
                <>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Select Your Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ mb: 2 }}
                  >
                    <option value="CUSTOMER">Customer (Book household services)</option>
                    <option value="WORKER">Worker (Join a Cooperative Federation)</option>
                    <option value="FEDERATION_ADMIN">Federation Admin (Co-op Officer)</option>
                  </TextField>
                </>
              )}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: tab === 0 ? 1 : 3 }}
              />

              {tab === 0 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    underline="hover"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotOpen(true);
                    }}
                    sx={{ fontWeight: 600, color: "#2563EB" }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 700 }}
              >
                {loading ? "Please wait..." : tab === 0 ? "Sign In to CoopServe" : "Create Account"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ style: { borderRadius: 16 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, color: "#0D47A1" }}>
          <LockResetIcon color="primary" /> Reset Account Password
        </DialogTitle>

        <DialogContent dividers>
          {forgotErr && <Alert severity="error" sx={{ mb: 2 }}>{forgotErr}</Alert>}
          {forgotMsg && <Alert severity="success" sx={{ mb: 2 }}>{forgotMsg}</Alert>}

          {forgotStep === 1 ? (
            <Box component="form" onSubmit={handleSendResetEmail}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enter your registered email address below. We will send you instructions to reset your password.
              </Typography>
              <TextField
                fullWidth
                label="Registered Email Address"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: 2 }}>
                Send Reset Request
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleConfirmReset}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enter a new password for account <strong>{forgotEmail}</strong>.
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: 2 }}>
                Confirm Reset Password
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setForgotOpen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
