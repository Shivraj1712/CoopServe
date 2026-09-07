import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Paper,
  Avatar,
  Chip,
  Rating,
  Skeleton,
  Divider,
  InputAdornment,
  Grow,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from "@mui/material";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import CarpenterIcon from "@mui/icons-material/Carpenter";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ParkIcon from "@mui/icons-material/Park";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";
import NavigationIcon from "@mui/icons-material/Navigation";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import DashboardLayout from "../components/DashboardLayout";
import StatusStepper from "../components/StatusStepper";
import NotificationToast from "../components/NotificationToast";

const SERVICE_CATEGORIES = [
  { name: "Electrical", icon: ElectricalServicesIcon, rate: "₹450/visit", desc: "Wiring, switchboard, MCB & appliances" },
  { name: "Plumbing", icon: PlumbingIcon, rate: "₹400/visit", desc: "Pipes, leaks, taps & bath fittings" },
  { name: "Carpentry", icon: CarpenterIcon, rate: "₹500/visit", desc: "Furniture repair, locks, doors & wood work" },
  { name: "Painting", icon: FormatPaintIcon, rate: "₹600/visit", desc: "Wall touch-ups, interior & exterior paint" },
  { name: "Caregiving", icon: MedicalServicesIcon, rate: "₹350/visit", desc: "Elderly assistance & nursing support" },
  { name: "Gardening", icon: ParkIcon, rate: "₹300/visit", desc: "Lawn trimming, terrace plant care" },
  { name: "Domestic Help", icon: CleaningServicesIcon, rate: "₹300/visit", desc: "Deep cleaning & housekeeping" },
  { name: "Driving", icon: DirectionsCarIcon, rate: "₹450/visit", desc: "Personal & commercial trip driver" }
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0: Directory, 1: Active Bookings, 2: Billing & Receipts
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sub-page state (No Modals!)
  const [subPage, setSubPage] = useState(null); // null | "book_service" | "pay_booking" | "rate_booking" | "view_receipt"
  const [selectedService, setSelectedService] = useState(null);
  const [address, setAddress] = useState("B-402, CG Road, Navrangpura, Ahmedabad");
  const [userLat, setUserLat] = useState(23.037);
  const [userLng, setUserLng] = useState(72.562);
  const [creating, setCreating] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Payment & Rating
  const [activeBooking, setActiveBooking] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Toast
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const socket = useSocket();

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("booking_status_updated", (data) => {
      setToast({
        open: true,
        message: `⚡ Live Update: Booking status updated to ${data.status}`,
        severity: "success"
      });
      fetchBookings();
    });

    return () => socket.off("booking_status_updated");
  }, [socket]);

  const handleOpenBooking = (category) => {
    setSelectedService(category);
    setSubPage("book_service");
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    setCreating(true);
    try {
      const res = await api.post("/bookings/create", {
        serviceCategory: selectedService.name,
        address,
        lat: userLat,
        lng: userLng
      });

      setToast({
        open: true,
        message: res.data.matchedWorker
          ? `Matched with nearby verified worker ${res.data.matchedWorker.name} (${res.data.matchedWorker.distanceKm} km away)!`
          : "Booking created! Searching for nearby available workers...",
        severity: "success"
      });

      setSubPage(null);
      fetchBookings();
      setActiveTab(1); // Switch to Active Bookings tab
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.error || "Booking failed", severity: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setToast({ open: true, message: "Booking cancelled", severity: "warning" });
      fetchBookings();
    } catch (err) {
      setToast({ open: true, message: "Failed to cancel booking", severity: "error" });
    }
  };

  const handlePayNow = async () => {
    if (!activeBooking) return;
    setPaying(true);
    try {
      const orderRes = await api.post("/payments/create-order", { bookingId: activeBooking.id });
      const orderId = orderRes.data.order.orderId;

      setTimeout(async () => {
        await api.post("/payments/verify", {
          bookingId: activeBooking.id,
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`
        });

        setPaying(false);
        setPaymentSuccess(true);

        setTimeout(() => {
          setPaymentSuccess(false);
          setSubPage(null);
          fetchBookings();
          setToast({ open: true, message: "Payment verified successfully!", severity: "success" });
        }, 1200);
      }, 1000);
    } catch (error) {
      console.error("Payment failed:", error);
      setToast({ open: true, message: "Payment failed", severity: "error" });
      setPaying(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!activeBooking) return;
    setSubmittingRating(true);
    try {
      await api.post(`/bookings/${activeBooking.id}/rate`, { stars, comment });
      setToast({ open: true, message: "Thank you for rating your service provider!", severity: "success" });
      setSubPage(null);
      fetchBookings();
    } catch (err) {
      setToast({ open: true, message: "Failed to submit rating", severity: "error" });
    } finally {
      setSubmittingRating(false);
    }
  };

  const filteredServices = SERVICE_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setSubPage(null); }}>
      
      {/* ========================================================
          SUB-PAGE 1: BOOKING CREATION PAGE (INLINE PAGE)
         ======================================================== */}
      {subPage === "book_service" && selectedService && (
        <Fade in timeout={300}>
          <Box sx={{ width: "100%", pb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSubPage(null)}
              sx={{ mb: 2, fontWeight: 700, borderRadius: 1.5 }}
            >
              Back to Services Directory
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: "#EFF6FF", color: "#1E3A8A", width: 56, height: 56 }}>
                  {React.createElement(selectedService.icon, { fontSize: "large" })}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800} color="#0F172A">
                    Book {selectedService.name} Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Auto-matching with verified workers from Gujarat Labour Cooperative Federation.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Service Location & Address
                  </Typography>
                  <TextField
                    fullWidth
                    label="Service Address"
                    multiline
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Latitude"
                        value={userLat}
                        onChange={(e) => setUserLat(parseFloat(e.target.value) || 23.037)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Longitude"
                        value={userLng}
                        onChange={(e) => setUserLng(parseFloat(e.target.value) || 72.562)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0F172A" gutterBottom>
                      Price & Co-op Split Breakdown
                    </Typography>

                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Standard Service Rate</Typography>
                        <Typography variant="body2" fontWeight={700}>{selectedService.rate}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Direct Worker Payout (90%)</Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main">90% Direct</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Welfare Reserve Fund (10%)</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.main">10% Reserve</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleConfirmBooking}
                      disabled={creating}
                      sx={{ py: 1.5, fontWeight: 700, borderRadius: 1.5 }}
                    >
                      {creating ? "Matching Nearby Worker..." : "Confirm Booking & Auto-Match Worker"}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* ========================================================
          SUB-PAGE 2: PAYMENT PAGE (INLINE PAGE)
         ======================================================== */}
      {subPage === "pay_booking" && activeBooking && (
        <Fade in timeout={300}>
          <Box sx={{ width: "100%", pb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSubPage(null)}
              sx={{ mb: 2, fontWeight: 700, borderRadius: 1.5 }}
            >
              Back to Active Bookings
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2, maxWidth: 650, mx: "auto" }}>
              {paymentSuccess ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: "#10B981", mb: 2 }} />
                  <Typography variant="h5" fontWeight={800} color="#10B981" gutterBottom>
                    Payment Successfully Processed!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ₹{activeBooking.amount} transferred. Cooperative commission recorded.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <PaymentIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight={800} color="#0F172A">
                      CoopServe Service Payment Page
                    </Typography>
                  </Box>

                  <Chip label="Transparent Federation Payment Gateway" color="primary" size="small" sx={{ mb: 3, fontWeight: 700 }} />

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <Typography variant="caption" color="text.secondary" display="block">Service Category</Typography>
                        <Typography variant="subtitle2" fontWeight={700}>{activeBooking.serviceCategory}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <Typography variant="caption" color="text.secondary" display="block">Assigned Worker</Typography>
                        <Typography variant="subtitle2" fontWeight={700}>{activeBooking.worker?.user?.name || "Co-op Worker"}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={0} sx={{ p: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2, mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">Worker Service Fee (90%)</Typography>
                      <Typography variant="body2" fontWeight={700}>₹{activeBooking.workerPayout || Math.round(activeBooking.amount * 0.9)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccountBalanceIcon fontSize="inherit" color="secondary" /> Co-op Federation Reserve (10%)
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="secondary">₹{activeBooking.commissionAmount || Math.round(activeBooking.amount * 0.1)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1" fontWeight={800}>Total Payable</Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="primary">₹{activeBooking.amount}</Typography>
                    </Box>
                  </Paper>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePayNow}
                    disabled={paying}
                    startIcon={paying ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                    sx={{ py: 1.5, fontWeight: 700, borderRadius: 1.5 }}
                  >
                    {paying ? "Processing Transaction..." : `Pay ₹${activeBooking.amount} Now`}
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </Fade>
      )}

      {/* ========================================================
          SUB-PAGE 3: RATING PAGE (INLINE PAGE)
         ======================================================== */}
      {subPage === "rate_booking" && activeBooking && (
        <Fade in timeout={300}>
          <Box sx={{ width: "100%", pb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSubPage(null)}
              sx={{ mb: 2, fontWeight: 700, borderRadius: 1.5 }}
            >
              Back to Active Bookings
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2, maxWidth: 600, mx: "auto" }}>
              <Typography variant="h5" fontWeight={800} color="#0F172A" gutterBottom>
                Rate Cooperative Worker Service
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Your review helps maintain quality standards across the Gujarat Labour Cooperative Federation.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Assigned Worker: {activeBooking.worker?.user?.name || "Cooperative Member"}
                </Typography>

                <Rating
                  value={stars}
                  onChange={(e, val) => setStars(val)}
                  size="large"
                  sx={{ my: 2 }}
                />

                <TextField
                  fullWidth
                  label="Feedback Comment"
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details regarding punctuality, quality of work, or professional demeanor..."
                  sx={{ mt: 2, mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={handleSubmitRating}
                  disabled={submittingRating}
                  startIcon={<StarIcon />}
                  sx={{ py: 1.5, fontWeight: 700, borderRadius: 1.5 }}
                >
                  {submittingRating ? "Submitting Review..." : "Submit Review"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* ========================================================
          SUB-PAGE 4: RECEIPT VIEW PAGE (INLINE PAGE)
         ======================================================== */}
      {subPage === "view_receipt" && activeBooking && (
        <Fade in timeout={300}>
          <Box sx={{ width: "100%", pb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSubPage(null)}
              sx={{ mb: 2, fontWeight: 700, borderRadius: 1.5 }}
            >
              Back to Bookings
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E2E8F0", borderRadius: 2, maxWidth: 600, mx: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight={800} color="#0F172A">
                  CoopServe Official Receipt
                </Typography>
                <Chip label="PAID & VERIFIED" color="success" size="small" sx={{ fontWeight: 800 }} />
              </Box>

              <Typography variant="caption" color="text.secondary" display="block">
                Receipt ID: REC-{activeBooking.id.substring(0, 8).toUpperCase()}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Service Category</Typography>
                  <Typography variant="body1" fontWeight={700}>{activeBooking.serviceCategory}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Customer Name</Typography>
                  <Typography variant="body1" fontWeight={700}>{user?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Assigned Worker</Typography>
                  <Typography variant="body1" fontWeight={700}>{activeBooking.worker?.user?.name || "Verified Co-op Worker"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Payment Date</Typography>
                  <Typography variant="body1" fontWeight={700}>{new Date(activeBooking.updatedAt || Date.now()).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>

              <Paper elevation={0} sx={{ p: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Worker Payout (90%)</Typography>
                  <Typography variant="body2" fontWeight={700}>₹{activeBooking.workerPayout || Math.round(activeBooking.amount * 0.9)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Co-op Welfare Reserve (10%)</Typography>
                  <Typography variant="body2" fontWeight={700}>₹{activeBooking.commissionAmount || Math.round(activeBooking.amount * 0.1)}</Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight={800}>Total Amount Paid</Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="primary">₹{activeBooking.amount}</Typography>
                </Box>
              </Paper>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => window.print()}
                startIcon={<ReceiptLongIcon />}
                sx={{ borderRadius: 1.5, fontWeight: 700 }}
              >
                Print Official Receipt
              </Button>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* ========================================================
          MAIN TAB 0: SERVICES DIRECTORY
         ======================================================== */}
      {subPage === null && activeTab === 0 && (
        <Grow in timeout={400}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 2.5,
                bgcolor: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 2
              }}
            >
              <Typography variant="h4" sx={{ color: "#1E3A8A", fontWeight: 800, mb: 1, letterSpacing: "-0.5px", fontSize: { xs: "1.25rem", sm: "1.75rem" } }}>
                Welcome back, {user?.name || "Customer"}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Book background-checked, verified workers directly from Labour Cooperative Federations. Direct 90% worker payouts + transparent 10% co-op welfare reserve funds.
              </Typography>
            </Paper>

            {/* Quick Metrics Bar */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">TOTAL BOOKINGS PLACED</Typography>
                  <Typography variant="h4" fontWeight={800} color="primary" sx={{ my: 0.5 }}>{bookings.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Verified booking history</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">ACTIVE JOB ORDERS</Typography>
                  <Typography variant="h4" fontWeight={800} color="warning.main" sx={{ my: 0.5 }}>
                    {bookings.filter(b => b.status === "REQUESTED" || b.status === "ACCEPTED" || b.status === "IN_PROGRESS").length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Real-time status tracking</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">COOPERATIVE WELFARE CONTRIBUTION (10%)</Typography>
                  <Typography variant="h4" fontWeight={800} color="secondary" sx={{ my: 0.5 }}>
                    ₹{bookings.reduce((sum, b) => sum + (b.commissionAmount || Math.round(b.amount * 0.1)), 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Worker healthcare & accident fund</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search trade skill category (e.g. Electrical, Plumbing, Painting...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                sx={{ background: "#FFFFFF", borderRadius: 2 }}
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: "#0F172A" }}>
              Trade Skills Directory ({filteredServices.length})
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {filteredServices.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <Grid item xs={12} sm={6} md={3} key={cat.name}>
                    <Card
                      onClick={() => handleOpenBooking(cat)}
                      sx={{
                        cursor: "pointer",
                        p: 1.5,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: "1px solid #E2E8F0",
                        borderRadius: 2,
                        transition: "all 0.15s ease",
                        "&:hover": { borderColor: "#2563EB", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)" }
                      }}
                    >
                      <CardContent sx={{ pb: 1, px: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Avatar sx={{ bgcolor: "#EFF6FF", color: "#1E3A8A", width: 44, height: 44, borderRadius: 2 }}>
                            <IconComp fontSize="medium" />
                          </Avatar>
                          <Chip label={cat.rate} size="small" color="primary" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                        </Box>

                        <Typography variant="h6" fontWeight={700} fontSize={16}>
                          {cat.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
                          {cat.desc}
                        </Typography>
                      </CardContent>

                      <Box sx={{ p: 1, pt: 0 }}>
                        <Button variant="outlined" color="primary" fullWidth size="small" sx={{ borderRadius: 1.5, fontWeight: 700 }}>
                          Book Service
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>


          </Box>
        </Grow>
      )}

      {/* ========================================================
          MAIN TAB 1: ACTIVE BOOKINGS
         ======================================================== */}
      {subPage === null && activeTab === 1 && (
        <Fade in timeout={400}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#0F172A" }}>
              My Active Job Orders & Live Proximity Tracking
            </Typography>

            {loading ? (
              <Grid container spacing={2}>
                {[1, 2].map((n) => (
                  <Grid item xs={12} key={n}>
                    <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            ) : bookings.length === 0 ? (
              <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px dashed #CBD5E1", bgcolor: "#FFFFFF" }}>
                <Typography variant="h6" fontWeight={700} color="text.secondary" gutterBottom>
                  No active job orders placed
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setActiveTab(0)} sx={{ mt: 1 }}>
                  Browse Services Directory
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((b) => (
                  <Grid item xs={12} key={b.id}>
                    <Card sx={{ p: 3, border: "1px solid #E2E8F0", borderRadius: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={7}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                            <Chip label={b.serviceCategory} color="primary" sx={{ fontWeight: 800 }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Order ID: {b.id.substring(0, 8)} • Placed {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>

                          <Typography variant="subtitle1" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, color: "#0F172A" }}>
                            <LocationOnIcon color="error" fontSize="small" /> {b.address}
                          </Typography>

                          {/* Matched Worker Profile Box */}
                          {b.worker ? (
                            <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", mt: 2, borderRadius: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                  <Avatar sx={{ bgcolor: "#0D47A1", fontWeight: 700 }}>{b.worker.user?.name?.[0]}</Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                      {b.worker.user?.name} <VerifiedIcon color="primary" fontSize="inherit" />
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {b.worker.cooperative?.name || "Gujarat Labour Co-op"} • Phone: {b.worker.user?.phone}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ textAlign: "right" }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#E65100" }}>
                                    <NavigationIcon fontSize="small" />
                                    <Typography variant="caption" fontWeight={700}>
                                      Proximity: ~0.8 km (10-12 mins)
                                    </Typography>
                                  </Box>
                                  <Rating value={b.worker.ratingAvg || 5} precision={0.1} readOnly size="small" />
                                </Box>
                              </Box>
                            </Paper>
                          ) : (
                            <Chip label="Searching for nearest available worker..." color="warning" sx={{ mt: 2 }} />
                          )}
                        </Grid>

                        {/* Status Stepper & Action Controls */}
                        <Grid item xs={12} md={5}>
                          <StatusStepper status={b.status} hasRating={Boolean(b.rating)} />

                          <Box sx={{ mt: 2, display: "flex", gap: 1.5, justifyContent: "flex-end", flexWrap: "wrap" }}>
                            {b.status === "REQUESTED" && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={() => handleCancelBooking(b.id)}
                              >
                                Cancel Booking
                              </Button>
                            )}

                            {b.status === "COMPLETED" && (
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PaymentIcon />}
                                onClick={() => { setActiveBooking(b); setSubPage("pay_booking"); }}
                              >
                                Pay ₹{b.amount}
                              </Button>
                            )}

                            {(b.status === "PAID" || b.status === "COMPLETED") && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                startIcon={<ReceiptLongIcon />}
                                onClick={() => { setActiveBooking(b); setSubPage("view_receipt"); }}
                              >
                                View Receipt
                              </Button>
                            )}

                            {b.status === "PAID" && !b.rating && (
                              <Button
                                variant="outlined"
                                color="warning"
                                startIcon={<StarIcon />}
                                onClick={() => { setActiveBooking(b); setSubPage("rate_booking"); }}
                              >
                                Rate Service
                              </Button>
                            )}

                            {b.status === "PAID" && b.rating && (
                              <Chip label={`Rated ⭐ ${b.rating.stars}/5`} color="success" />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

      {/* ========================================================
          MAIN TAB 2: BILLING & RECEIPTS LEDGER
         ======================================================== */}
      {subPage === null && activeTab === 2 && (
        <Fade in timeout={400}>
          <Paper elevation={0} sx={{ border: "1px solid #E2E8F0" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #E2E8F0" }}>
              <Typography variant="h6" fontWeight={800}>
                Customer Billing & Receipts History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete itemized billing ledger with direct worker payout vs co-op fund breakdown.
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Assigned Worker</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Gross Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell sx={{ fontFamily: "monospace" }}>{b.id.substring(0, 8)}</TableCell>
                      <TableCell>{b.serviceCategory}</TableCell>
                      <TableCell>{b.worker?.user?.name || "Unassigned"}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>₹{b.amount}</TableCell>
                      <TableCell>
                        <Chip label={b.status} color={b.status === "PAID" ? "success" : "info"} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ReceiptLongIcon />}
                          onClick={() => { setActiveBooking(b); setSubPage("view_receipt"); }}
                        >
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Fade>
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
