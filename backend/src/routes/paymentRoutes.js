import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", authenticateToken, createPaymentOrder);
router.post("/verify", authenticateToken, verifyPayment);

export default router;
