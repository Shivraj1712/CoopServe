import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import { useAuth } from "../context/AuthContext";

export default function MyProfileView({ onNavigateToAccount }) {
  const { user } = useAuth();

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

  if (!user) return null;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Profile Header Hero */}
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
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                fontSize: { xs: 28, sm: 36 },
                fontWeight: 800,
                border: "3px solid #FFFFFF"
              }}
            >
              {user.name?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
              <Typography variant="h5" fontWeight={800} color="#FFFFFF">
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

      {/* Main Profile Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Membership & Identity Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={800} color="#0F172A" sx={{ mb: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Cooperative Identity
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AccountBalanceIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Federation Affiliate</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#0F172A">Gujarat Labour Co-op</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <ShieldCheckIcon color="success" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Verification Standing</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#10B981">Verified Member Active</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <BadgeIcon color="secondary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Member Registration ID</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                      MEM-GJ-2026-{user.id?.substring(0, 6).toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Profile Overview Card */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="h6" fontWeight={800} color="#0F172A">
                Profile Information
              </Typography>
              {onNavigateToAccount && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SecurityIcon />}
                  onClick={onNavigateToAccount}
                  sx={{ borderRadius: 1.5, fontWeight: 700 }}
                >
                  Edit in Account Settings
                </Button>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Overview of your registered cooperative account identity details.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 1.5, border: "1px solid #E2E8F0" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Full Name
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PersonIcon fontSize="small" color="action" /> {user.name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 1.5, border: "1px solid #E2E8F0" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Phone Number
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PhoneIcon fontSize="small" color="action" /> {user.phone || "+91 9876543210"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 1.5, border: "1px solid #E2E8F0" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email Address
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" /> {user.email}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 1.5, border: "1px solid #E2E8F0" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Account Classification
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#0F172A" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <BadgeIcon fontSize="small" color="action" /> {getRoleLabel(user.role)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

