import express from "express";
import {
  getAdminDashboardStats,
  getPendingWorkers,
  verifyWorker,
  getAllBookings,
  getDemandForecast
} from "../controllers/adminController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizeRoles("FEDERATION_ADMIN"), getAdminDashboardStats);
router.get("/workers/pending", authenticateToken, authorizeRoles("FEDERATION_ADMIN"), getPendingWorkers);
router.put("/workers/:id/verify", authenticateToken, authorizeRoles("FEDERATION_ADMIN"), verifyWorker);
router.get("/bookings", authenticateToken, authorizeRoles("FEDERATION_ADMIN"), getAllBookings);
router.get("/forecast", authenticateToken, authorizeRoles("FEDERATION_ADMIN"), getDemandForecast);

export default router;
