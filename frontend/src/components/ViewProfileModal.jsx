import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Divider,
  Paper
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import EditIcon from "@mui/icons-material/Edit";

export default function ViewProfileModal({ open, onClose, user, onEditClick }) {
  if (!user) return null;

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ style: { borderRadius: 20 } }}
    >
      <DialogTitle sx={{ p: 0 }}>
        {/* Profile Card Header Banner */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
            color: "#FFFFFF",
            p: 3,
            textAlign: "center",
            position: "relative",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 1.5,
              fontSize: 28,
              fontWeight: 800,
              border: "3px solid #FFFFFF",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
            }}
          >
            {user.name?.[0]}
          </Avatar>
          <Typography variant="h6" fontWeight={800} color="#FFFFFF">
            {user.name}
          </Typography>
          <Chip
            icon={<VerifiedIcon style={{ color: "#10B981" }} />}
            label={getRoleLabel(user.role)}
            color={getRoleColor(user.role)}
            size="small"
            sx={{ mt: 1, fontWeight: 700 }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 2 }}>
          Account & Credentials Overview
        </Typography>

        <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Email Address</Typography>
                  <Typography variant="body2" fontWeight={700} color="#0F172A">{user.email}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneIcon fontSize="small" color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Phone Contact</Typography>
                  <Typography variant="body2" fontWeight={700} color="#0F172A">{user.phone || "+91 9876543210"}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, bgcolor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <ShieldCheckIcon color="primary" />
          <Box>
            <Typography variant="caption" fontWeight={700} color="#1E3A8A">Federation Verification</Typography>
            <Typography variant="body2" fontSize={12} color="text.secondary">
              Gujarat Labour Co-op Member ID: <strong>MEM-GJ-2026-{user.id?.substring(0, 6).toUpperCase()}</strong>
            </Typography>
          </Box>
        </Paper>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5, justifyContent: "space-between" }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {
            onClose();
            onEditClick();
          }}
          sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}
        >
          Edit Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
}
