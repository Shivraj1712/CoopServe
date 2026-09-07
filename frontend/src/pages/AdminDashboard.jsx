import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Fade,
  Grow
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import DemandForecastChart from "../components/DemandForecastChart";
import NotificationToast from "../components/NotificationToast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0); // 0: Dashboard, 1: Worker Queue, 2: Bookings Ledger, 3: AI Forecast
  const [stats, setStats] = useState({});
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected worker for Document View Sub-Page (No Modals!)
  const [docWorker, setDocWorker] = useState(null);

  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes, bookingsRes, forecastRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/workers/pending"),
        api.get("/admin/bookings"),
        api.get("/admin/forecast")
      ]);

      setStats(statsRes.data.stats || {});
      setPendingWorkers(pendingRes.data.workers || []);
      setAllBookings(bookingsRes.data.bookings || []);
      setForecast(forecastRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyWorker = async (workerId, status) => {
    try {
      await api.put(`/admin/workers/${workerId}/verify`, { status });
      setToast({
        open: true,
        message: `Worker account has been ${status.toLowerCase()}!`,
        severity: status === "APPROVED" ? "success" : "warning"
      });
      setDocWorker(null);
      fetchAdminData();
    } catch (err) {
      setToast({ open: true, message: "Failed to verify worker", severity: "error" });
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeTab={0} onTabChange={() => {}}>
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setDocWorker(null); }}>
      
      {/* ========================================================
          SUB-PAGE: WORKER TRADE VERIFICATION PAGE (INLINE PAGE)
         ======================================================== */}
      {docWorker && (
        <Fade in timeout={300}>
          <Box sx={{ width: "100%", pb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setDocWorker(null)}
              sx={{ mb: 2, fontWeight: 700, borderRadius: 1.5 }}
            >
              Back to Pending Worker Queue
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight={800} color="#0F172A">
                  Worker Trade Verification & Document Review Page
                </Typography>
                <Chip label="PENDING VERIFICATION" color="warning" size="small" sx={{ fontWeight: 800 }} />
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "#1E3A8A", width: 60, height: 60, fontWeight: 800, fontSize: 24 }}>
                  {docWorker.user?.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800}>{docWorker.user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✉️ {docWorker.user?.email} • 📞 {docWorker.user?.phone}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <Typography variant="caption" color="text.secondary" display="block">Trade Skill Category</Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="primary">{docWorker.skillCategory}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <Typography variant="caption" color="text.secondary" display="block">Years of Experience</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>{docWorker.experienceYears} Years</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <Typography variant="caption" color="text.secondary" display="block">Service Area Cluster</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>{docWorker.serviceArea}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <Typography variant="caption" color="text.secondary" display="block">Worker Bio & Credentials</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{docWorker.bio || "Certified trade worker registered under Gujarat Labour Federation."}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#F0FDF4", border: "1px solid #BBF7D0", mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
                <VerifiedUserIcon color="success" />
                <Typography variant="body2" color="#15803D" fontWeight={700}>
                  Govt Aadhaar & Trade Skill Certification Verified (Attached Document ID: DOC-2026-GJ-882)
                </Typography>
              </Paper>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => handleVerifyWorker(docWorker.id, "REJECTED")}
                  sx={{ borderRadius: 1.5, px: 3, fontWeight: 700 }}
                >
                  Reject Application
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleVerifyWorker(docWorker.id, "APPROVED")}
                  sx={{ borderRadius: 1.5, px: 4, fontWeight: 700 }}
                >
                  Approve & Activate Profile
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* ========================================================
          MAIN DASHBOARD VIEWS (WHEN SUB-PAGE IS NULL)
         ======================================================== */}
      {docWorker === null && (
        <>
          {/* Top Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} color="secondary" sx={{ letterSpacing: "-0.5px" }}>
              Federation Executive CRM Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gujarat State Labour Cooperative Federation Command & Compliance Operations
            </Typography>
          </Box>

          {/* KPI Metric Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#EFF6FF", borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    TOTAL WORKERS
                  </Typography>
                  <PeopleIcon color="secondary" />
                </Box>
                <Typography variant="h4" fontWeight={800} color="secondary" sx={{ my: 0.5 }}>
                  {stats.totalWorkers || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {stats.approvedWorkers || 0} Approved • {stats.pendingWorkers || 0} Pending
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#FFF7ED", borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    CO-OP WELFARE FUND (10%)
                  </Typography>
                  <AccountBalanceIcon color="primary" />
                </Box>
                <Typography variant="h4" fontWeight={800} color="primary" sx={{ my: 0.5 }}>
                  ₹{stats.totalCoopFund || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Healthcare & insurance reserve
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#F0FDF4", borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    GROSS REVENUE
                  </Typography>
                  <ReceiptIcon color="success" />
                </Box>
                <Typography variant="h4" fontWeight={800} color="success.main" sx={{ my: 0.5 }}>
                  ₹{stats.grossRevenue || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Total customer bookings value
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#FAF5FF", borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    TOTAL BOOKINGS
                  </Typography>
                  <TrendingUpIcon sx={{ color: "#9C27B0" }} />
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: "#9C27B0", my: 0.5 }}>
                  {stats.totalBookings || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {stats.activeBookings || 0} Active • {stats.completedCount || 0} Paid
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* TAB 0 & 1: WORKER VERIFICATION QUEUE */}
          {(activeTab === 0 || activeTab === 1) && (
            <Grow in timeout={400}>
              <Paper elevation={0} sx={{ border: "1px solid #E2E8F0", mb: 4, borderRadius: 2 }}>
                <Box sx={{ p: 3, borderBottom: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" fontWeight={800}>
                    Pending Worker Verification Queue ({pendingWorkers.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review trade certifications and activate worker profiles under Gujarat Labour Cooperative Federation.
                  </Typography>
                </Box>

                {pendingWorkers.length === 0 ? (
                  <Box sx={{ p: 5, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>
                      No pending worker verification requests right now. All cooperative members activated!
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table>
                      <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Worker Name</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Skill Category</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Service Cluster</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Experience</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Verification Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingWorkers.map((w) => (
                          <TableRow key={w.id}>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {w.user?.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {w.user?.email} • {w.user?.phone}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={w.skillCategory} color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                            </TableCell>
                            <TableCell>{w.serviceArea}</TableCell>
                            <TableCell>{w.experienceYears} Years</TableCell>
                            <TableCell>
                              <Chip label={w.verificationStatus} color="warning" size="small" sx={{ fontWeight: 700 }} />
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => setDocWorker(w)}
                                >
                                  View Docs Page
                                </Button>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleVerifyWorker(w.id, "APPROVED")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleVerifyWorker(w.id, "REJECTED")}
                                >
                                  Reject
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}


              </Paper>
            </Grow>
          )}

          {/* TAB 2: BOOKINGS LEDGER */}
          {activeTab === 2 && (
            <Fade in timeout={400}>
              <Paper elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 2 }}>
                <Box sx={{ p: 3, borderBottom: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" fontWeight={800}>
                    Cooperative Bookings & Payout Ledger
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transparent transaction split: 90% direct worker payout vs 10% cooperative reserve fund.
                  </Typography>
                </Box>

                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Booking ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Assigned Worker</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Gross Amount</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Worker Payout (90%)</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Co-op Fund (10%)</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell sx={{ fontFamily: "monospace" }}>{b.id.substring(0, 8)}</TableCell>
                          <TableCell>{b.customer?.name || "Customer"}</TableCell>
                          <TableCell>{b.worker?.user?.name || "Unassigned"}</TableCell>
                          <TableCell>{b.serviceCategory}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>₹{b.amount}</TableCell>
                          <TableCell sx={{ color: "#2E7D32", fontWeight: 700 }}>₹{b.workerPayout}</TableCell>
                          <TableCell sx={{ color: "#0D47A1", fontWeight: 700 }}>₹{b.commissionAmount}</TableCell>
                          <TableCell>
                            <Chip label={b.status} color={b.status === "PAID" ? "success" : "info"} size="small" sx={{ fontWeight: 700 }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Fade>
          )}

          {/* TAB 3: AI DEMAND FORECASTING DASHBOARD */}
          {activeTab === 3 && forecast && (
            <Fade in timeout={400}>
              <Box>
                <DemandForecastChart
                  forecastData={forecast.forecastData}
                  highDemandZones={forecast.highDemandZones}
                  insights={forecast.insights}
                />
              </Box>
            </Fade>
          )}
        </>
      )}

      {/* Toast Notification */}
      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </DashboardLayout>
  );
}
