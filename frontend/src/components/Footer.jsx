import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";
import { useLocation } from "react-router-dom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";

export default function Footer({ embedded = false }) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/worker") ||
    location.pathname.startsWith("/admin");

  // Only hide global footer in App.jsx when on dashboard routes; embedded footer in DashboardLayout will render
  if (isDashboardRoute && !embedded) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactModalOpen(false);
    }, 1500);
  };

  return (
    <Box component="footer" sx={{ bg: "#0F172A", bgcolor: "#0F172A", color: "#F8FAFC", pt: 7, pb: 4, mt: 8, borderTop: "1px solid #1E293B" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Brand & Mission */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Avatar sx={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)", width: 42, height: 42 }}>
                <HandshakeIcon />
              </Avatar>
              <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 800, letterSpacing: "-0.5px" }}>
                CoopServe
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2.5, lineHeight: 1.6 }}>
              CoopServe is a cooperative-owned marketplace connecting households with certified, verified gig workers under Labour Cooperative Federations. Direct 90% worker payouts + transparent 10% cooperative welfare reserve fund.
            </Typography>

            <Chip
              icon={<ShieldCheckIcon style={{ color: "#10B981" }} />}
              label="100% Certified Labour Cooperative Network"
              variant="outlined"
              sx={{ color: "#E2E8F0", borderColor: "#334155", fontWeight: 700 }}
            />
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" sx={{ color: "#FFFFFF", fontWeight: 800, mb: 2 }}>
              Quick Portals
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Link href="/customer" color="inherit" underline="hover" variant="body2" sx={{ color: "#94A3B8" }}>
                Customer Booking
              </Link>
              <Link href="/worker" color="inherit" underline="hover" variant="body2" sx={{ color: "#94A3B8" }}>
                Worker Duty Portal
              </Link>
              <Link href="/admin" color="inherit" underline="hover" variant="body2" sx={{ color: "#94A3B8" }}>
                Federation Command
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2" sx={{ color: "#94A3B8" }}>
                Co-op Welfare Ledger
              </Link>
            </Box>
          </Grid>

          {/* Column 3: Services */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" sx={{ color: "#FFFFFF", fontWeight: 800, mb: 2 }}>
              Trade Skills
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>Electrical Services</Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>Plumbing & Sanitation</Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>Carpentry & Furniture</Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>Interior Painting</Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>Elderly Caregiving</Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>Lawn & Gardening</Typography>
            </Box>
          </Grid>

          {/* Column 4: Contact & Helpdesk Details */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ color: "#FFFFFF", fontWeight: 800, mb: 2 }}>
              Contact & Support HQ
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOnIcon sx={{ color: "#2563EB", fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                  CoopServe Federation HQ, CG Road, Navrangpura, Ahmedabad, Gujarat 380009
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneIcon sx={{ color: "#10B981", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                  +91 79 2630 1234 / Toll-Free: 1800-425-COOP
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailIcon sx={{ color: "#3B82F6", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                  support@coopserve.in | helpdesk@coopserve.in
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AccessTimeIcon sx={{ color: "#F59E0B", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                  Working Hours: Mon - Sat: 8:00 AM - 8:00 PM IST
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setContactModalOpen(true)}
                sx={{ mt: 1, alignSelf: "flex-start", borderRadius: 8 }}
              >
                Contact Helpdesk
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "#1E293B" }} />

        {/* Footer Bottom Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            © 2026 CoopServe Cooperative Gig Services Platform. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="#" color="inherit" underline="hover" variant="caption" sx={{ color: "#64748B" }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="caption" sx={{ color: "#64748B" }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="caption" sx={{ color: "#64748B" }}>
              Cooperative Transparency Charter
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Contact Support Dialog */}
      <Dialog open={contactModalOpen} onClose={() => setContactModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#0D47A1" }}>
          Contact CoopServe Support
        </DialogTitle>
        <DialogContent dividers>
          {submitted ? (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700} color="success.main">
                Message Sent Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Our cooperative support team will contact you shortly.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleContactSubmit}>
              <TextField fullWidth label="Your Name" required sx={{ mb: 2 }} />
              <TextField fullWidth label="Email or Phone" required sx={{ mb: 2 }} />
              <TextField fullWidth label="Subject / Query" multiline rows={3} required sx={{ mb: 2 }} />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit Query
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContactModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
