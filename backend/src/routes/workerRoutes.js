import express from "express";
import { onboardWorker, toggleAvailability, getWorkerBookings, getAvailableWorkers } from "../controllers/workerController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/available", authenticateToken, getAvailableWorkers);
router.post("/onboard", authenticateToken, authorizeRoles("WORKER"), onboardWorker);
router.put("/availability", authenticateToken, authorizeRoles("WORKER"), toggleAvailability);
router.get("/bookings", authenticateToken, authorizeRoles("WORKER"), getWorkerBookings);

export default router;
