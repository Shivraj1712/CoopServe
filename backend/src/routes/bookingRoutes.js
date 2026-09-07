import express from "express";
import {
  createBooking,
  acceptBooking,
  updateBookingStatus,
  rateBooking,
  getCustomerBookings,
  getBookingById,
  cancelBooking
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateToken, createBooking);
router.get("/my-bookings", authenticateToken, getCustomerBookings);
router.get("/:id", authenticateToken, getBookingById);
router.put("/:id/accept", authenticateToken, acceptBooking);
router.put("/:id/status", authenticateToken, updateBookingStatus);
router.put("/:id/cancel", authenticateToken, cancelBooking);
router.post("/:id/rate", authenticateToken, rateBooking);

export default router;
