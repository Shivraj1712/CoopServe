import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme/theme";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SocketProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<AuthPage />} />

                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/worker"
                    element={
                      <ProtectedRoute allowedRoles={["WORKER"]}>
                        <WorkerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["FEDERATION_ADMIN"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
