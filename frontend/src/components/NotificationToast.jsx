import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function NotificationToast({ open, message, severity = "info", onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%", borderRadius: 3, fontWeight: 600 }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
