import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Paper,
  Chip,
  CircularProgress
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import api from "../services/api";

export default function SimplePaymentModal({ open, onClose, booking, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  if (!booking) return null;

  const totalAmount = booking.amount || 400;
  const workerPayout = booking.workerPayout || Math.round(totalAmount * 0.9);
  const coopFund = booking.commissionAmount || Math.round(totalAmount * 0.1);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      // 1. Create payment order
      const orderRes = await api.post("/payments/create-order", { bookingId: booking.id });
      const orderId = orderRes.data.order.orderId;

      // Simulate 1 second payment gateway processing
      setTimeout(async () => {
        // 2. Verify payment
        await api.post("/payments/verify", {
          bookingId: booking.id,
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`
        });

        setLoading(false);
        setSuccessState(true);

        setTimeout(() => {
          setSuccessState(false);
          onSuccess();
          onClose();
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, bg: "#0D47A1", color: "#0D47A1" }}>
        <PaymentIcon />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CoopServe Payment Interface
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {successState ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: "#2E7D32", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#2E7D32" }}>
              Payment Successful!
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
              ₹{totalAmount} transferred. Cooperative commission recorded.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Chip
              label="Mock Gateway Mode (Phase 1)"
              color="warning"
              size="small"
              sx={{ mb: 2, fontWeight: 700 }}
            />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Service: <strong>{booking.serviceCategory}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Assigned Worker: <strong>{booking.worker?.user?.name || "Verified Cooperative Worker"}</strong>
            </Typography>

            <Paper elevation={0} sx={{ p: 2, bg: "#F8FAFC", border: "1px solid #E2E8F0", my: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Worker Service Fee (90%)
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ₹{workerPayout}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccountBalanceIcon fontSize="inherit" color="secondary" /> Co-op Federation Fund (10%)
                </Typography>
                <Typography variant="body2" fontWeight={600} color="secondary">
                  ₹{coopFund}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Total Payable
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="primary">
                  ₹{totalAmount}
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748B" }}>
              <SecurityIcon fontSize="small" />
              <Typography variant="caption">
                Guaranteed by Verified Labour Federation Network
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {!successState && (
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayNow}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
            sx={{ px: 4 }}
          >
            {loading ? "Processing..." : `Pay ₹${totalAmount}`}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
