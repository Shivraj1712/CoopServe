import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CoopServe Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

let DEFAULT_PORT = parseInt(process.env.PORT) || 5000;

function startServer(port) {
  server.listen(port, () => {
    console.log(`🚀 CoopServe Backend Server running on port ${port}`);
    console.log(`⚡ Socket.io listening for real-time booking updates`);
  });
}

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`⚠️ Port ${DEFAULT_PORT} is in use. Trying port ${DEFAULT_PORT + 1}...`);
    DEFAULT_PORT += 1;
    setTimeout(() => {
      startServer(DEFAULT_PORT);
    }, 300);
  } else {
    console.error("Server error:", err);
  }
});

startServer(DEFAULT_PORT);
