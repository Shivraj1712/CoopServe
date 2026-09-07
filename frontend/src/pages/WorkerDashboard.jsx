import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  Box,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
  Stepper,
  Step,
  StepLabel,
  TextField,
  CircularProgress,
  Fade,
  Grow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import DashboardLayout from "../components/DashboardLayout";
import NotificationToast from "../components/NotificationToast";

const ONBOARDING_STEPS = ["Skill & Service Area", "Cooperative Selection", "Document Verification"];

export default function WorkerDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState(0); // 0: Duty Command, 1: Job Orders, 2: Earnings Ledger
  const [workerData, setWorkerData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  // Onboarding Form state
  const [activeStep, setActiveStep] = useState(0);
  const [skillCategory, setSkillCategory] = useState("Electrical");
  const [serviceArea, setServiceArea] = useState("Navrangpura & CG Road");
  const [experienceYears, setExperienceYears] = useState("5");
  const [bio, setBio] = useState("Certified electrician with 5+ years experience.");

  // Toast
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const socket = useSocket();

  const fetchWorkerData = async () => {
    try {
      const res = await api.get("/workers/bookings");
      setWorkerData(res.data.worker);
      setBookings(res.data.bookings || []);
      setStats(res.data.stats || {});
      setIsAvailable(res.data.worker?.isAvailable ?? true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_job_assigned", (job) => {
      setToast({
        open: true,
        message: `🔔 New Job Alert! ${job.serviceCategory} requested at ${job.address}`,
        severity: "warning"
      });
      fetchWorkerData();
    });

    return () => socket.off("new_job_assigned");
  }, [socket]);

  const handleToggleAvailability = async (e) => {
    const val = e.target.checked;
    setIsAvailable(val);
    try {
      await api.put("/workers/availability", { isAvailable: val });
      setToast({ open: true, message: `Availability status set to ${val ? 'Active' : 'Offline'}`, severity: "info" });
    } catch (err) {
      setToast({ open: true, message: "Failed to update availability", severity: "error" });
    }
  };

  const handleAcceptJob = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/accept`);
      setToast({ open: true, message: "Job accepted! Customer has been notified.", severity: "success" });
      fetchWorkerData();
    } catch (err) {
      setToast({ open: true, message: "Failed to accept job", severity: "error" });
    }
  };

  const handleUpdateJobStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setToast({ open: true, message: `Job status updated to ${status}`, severity: "success" });
      fetchWorkerData();
    } catch (err) {
      setToast({ open: true, message: "Failed to update job status", severity: "error" });
    }
  };

  const handleOnboardSubmit = async () => {
    try {
      await api.post("/workers/onboard", {
        skillCategory,
        serviceArea,
        experienceYears,
        bio
      });
      setToast({ open: true, message: "Onboarding details submitted for Federation Approval!", severity: "success" });
      fetchWorkerData();
    } catch (err) {
      setToast({ open: true, message: "Onboarding failed", severity: "error" });
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

  // If worker profile needs onboarding or is pending approval
  if (!workerData || workerData.verificationStatus === "PENDING") {
    return (
      <DashboardLayout activeTab={0} onTabChange={() => {}}>
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <EngineeringIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: "#E65100" }} />
            <Box>
              <Typography variant="h5" fontWeight={800} color="primary" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                Worker Cooperative Onboarding
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register under Gujarat State Labour Cooperative Federation
              </Typography>
            </Box>
          </Box>

          {workerData?.verificationStatus === "PENDING" ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <HourglassEmptyIcon sx={{ fontSize: 60, color: "#ED6C02", mb: 2 }} />
              <Typography variant="h6" fontWeight={700} color="warning.main">
                Verification Pending Federation Approval
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mt: 1 }}>
                Your worker documents and skill category (<strong>{workerData.skillCategory}</strong>) have been submitted. 
                The Federation Admin will review and activate your account shortly.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"} alternativeLabel={!isMobile} sx={{ mb: 4 }}>
                {ONBOARDING_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Box>
                  <TextField
                    fullWidth
                    select
                    label="Skill Category"
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ mb: 2 }}
                  >
                    <option value="Electrical">Electrical Services</option>
                    <option value="Plumbing">Plumbing & Sanitation</option>
                    <option value="Carpentry">Carpentry & Woodwork</option>
                    <option value="Painting">Painting & Waterproofing</option>
                    <option value="Caregiving">Elderly & Patient Caregiving</option>
                    <option value="Gardening">Lawn & Terrace Gardening</option>
                    <option value="Domestic Help">Domestic Housekeeping</option>
                    <option value="Driving">Vehicle Driver</option>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Service Area / Cluster"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Years of Experience"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button variant="contained" color="primary" onClick={() => setActiveStep(1)}>
                    Next: Select Cooperative
                  </Button>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Paper elevation={0} sx={{ p: 2, bg: "#F8FAFC", border: "1px solid #E2E8F0", mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="secondary">
                      Associated Federation:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gujarat State Labour Co-operative Federation (COOP-GJ-01) • Gujarat Region
                    </Typography>
                  </Paper>

                  <TextField
                    fullWidth
                    label="Short Bio / Experience Description"
                    multiline
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" onClick={() => setActiveStep(0)}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(2)}>
                      Next: Upload Documents
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Upload your Trade Certification / Govt ID for Federation Verification.
                  </Typography>

                  <Paper elevation={0} sx={{ p: 3, textAlign: "center", border: "2px dashed #CBD5E1", mb: 3 }}>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      📁 Skilled Trade Certificate & Aadhaar ID attached (Mock Document ID: DOC-2026-GJ-882)
                    </Typography>
                  </Paper>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleOnboardSubmit}>
                      Submit for Federation Verification
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>

        <NotificationToast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        />
      </DashboardLayout>
    );
  }

  // ACTIVE APPROVED WORKER PORTAL
  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(t) => setActiveTab(t)}>
      {/* Top Duty Controls Banner */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Worker Duty Command Center <CheckCircleIcon color="success" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Skill: <strong>{workerData.skillCategory}</strong> • Cluster: <strong>{workerData.serviceArea}</strong>
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ px: 3, py: 1, border: "1px solid #E2E8F0", borderRadius: 8 }}>
          <FormControlLabel
            control={
              <Switch checked={isAvailable} onChange={handleToggleAvailability} color="success" />
            }
            label={
              <Typography variant="subtitle2" fontWeight={700} color={isAvailable ? "success.main" : "text.secondary"}>
                {isAvailable ? "Duty Status: ONLINE (Receiving Jobs)" : "Duty Status: OFFLINE"}
              </Typography>
            }
          />
        </Paper>
      </Box>

      {/* KPI Overview Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#FFF7ED" }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              TOTAL WORKER PAYOUT (90%)
            </Typography>
            <Typography variant="h4" fontWeight={800} color="primary" sx={{ my: 0.5 }}>
              ₹{stats.totalEarnings || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Direct transfer to bank account
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#EFF6FF" }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              COOPERATIVE WELFARE FUND (10%)
            </Typography>
            <Typography variant="h4" fontWeight={800} color="secondary" sx={{ my: 0.5 }}>
              ₹{stats.cooperativeFundContribution || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Health & accident reserve fund
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0", bgcolor: "#F0FDF4" }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              AVERAGE CUSTOMER RATING
            </Typography>
            <Typography variant="h4" fontWeight={800} color="success.main" sx={{ my: 0.5 }}>
              ⭐ {workerData.ratingAvg || 5.0} / 5.0
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Based on verified completed reviews
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* TAB 0 & 1: ACTIVE JOB ORDERS */}
      {(activeTab === 0 || activeTab === 1) && (
        <Grow in timeout={400}>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: "#0F172A" }}>
              Assigned Job Orders & Duty State Controls
            </Typography>

            {bookings.length === 0 ? (
              <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px dashed #CBD5E1" }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>
                  No active job requests right now. Keep your duty status ONLINE to receive real-time bookings!
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((b) => (
                  <Grid item xs={12} key={b.id}>
                    <Card sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={7}>
                          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1 }}>
                            <Chip label={b.status} color={b.status === "COMPLETED" || b.status === "PAID" ? "success" : "warning"} sx={{ fontWeight: 800 }} />
                            <Typography variant="subtitle1" fontWeight={700}>
                              {b.serviceCategory} Service
                            </Typography>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, my: 1 }}>
                            <LocationOnIcon fontSize="small" color="error" /> {b.address}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Customer: <strong>{b.customer?.name}</strong> • Phone: <strong>{b.customer?.phone}</strong>
                          </Typography>

                          <Paper elevation={0} sx={{ p: 1.5, bg: "#F8FAFC", mt: 2, display: "inline-block", border: "1px solid #E2E8F0" }}>
                            <Typography variant="caption" color="text.secondary">
                              Gross Charge: <strong>₹{b.amount}</strong> | Net Worker Payout: <strong style={{ color: "#E65100" }}>₹{b.workerPayout || Math.round(b.amount * 0.9)}</strong> (90%)
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Duty State Machine Controls */}
                        <Grid item xs={12} md={5} sx={{ textAlign: { md: "right" } }}>
                          {b.status === "REQUESTED" && (
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleAcceptJob(b.id)}
                            >
                              Accept Job Request
                            </Button>
                          )}

                          {b.status === "ACCEPTED" && (
                            <Button
                              variant="contained"
                              color="warning"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => handleUpdateJobStatus(b.id, "IN_PROGRESS")}
                            >
                              Start Work at Location
                            </Button>
                          )}

                          {b.status === "IN_PROGRESS" && (
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<TaskAltIcon />}
                              onClick={() => handleUpdateJobStatus(b.id, "COMPLETED")}
                            >
                              Complete Work
                            </Button>
                          )}

                          {(b.status === "COMPLETED" || b.status === "PAID") && (
                            <Chip label="Work Completed & Paid" color="success" size="large" sx={{ fontWeight: 800 }} />
                          )}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}


          </Box>
        </Grow>
      )}

      {/* TAB 2: EARNINGS & WELFARE LEDGER */}
      {activeTab === 2 && (
        <Fade in timeout={400}>
          <Paper elevation={0} sx={{ border: "1px solid #E2E8F0" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E2E8F0" }}>
              <Typography variant="h6" fontWeight={800}>
                Worker Earnings & Welfare Reserve Ledger
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed transaction log showing 90% payout vs 10% cooperative fund contribution.
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead sx={{ bg: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Job ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Gross Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Net Payout (90%)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Co-op Fund (10%)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell sx={{ fontFamily: "monospace" }}>{b.id.substring(0, 8)}</TableCell>
                      <TableCell>{b.serviceCategory}</TableCell>
                      <TableCell>{b.customer?.name}</TableCell>
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

      {/* Toast */}
      <NotificationToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </DashboardLayout>
  );
}
