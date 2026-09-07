import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "../services/api";

export default function EditProfileModal({ open, onClose, user, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPassword("");
      setError("");
      setSuccessMsg("");
    }
  }, [user, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.put("/auth/profile", { name, phone, password });
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        onSuccess(res.data.user);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ style: { borderRadius: 20 } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: 800, color: "#1E3A8A" }}>
        <EditIcon color="primary" /> Edit Account Profile
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            value={user?.email || ""}
            disabled
            sx={{ mb: 2 }}
            helperText="Email address cannot be changed"
          />

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
            label="New Password (Leave blank to keep current)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit" disabled={loading} sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
