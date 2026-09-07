import { PrismaClient } from "@prisma/client";
import { paymentService } from "../services/paymentService.js";
import { notificationService } from "../services/notificationService.js";

const prisma = new PrismaClient();

export async function createPaymentOrder(req, res) {
  try {
    const { bookingId } = req.body;
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const orderData = await paymentService.createOrder({
      amount: booking.amount,
      receipt: `rcpt_${booking.id.substring(0, 8)}`
    });

    return res.json({ order: orderData, booking });
  } catch (error) {
    console.error("Payment Order Error:", error);
    return res.status(500).json({ error: "Failed to create payment order" });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const verification = await paymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!verification.success) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Upsert Payment Record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        razorpayOrderId: razorpayOrderId || `MOCK_ORD_${Date.now()}`,
        razorpayPaymentId: razorpayPaymentId || `MOCK_PAY_${Date.now()}`,
        status: "SUCCESS",
        amount: booking.amount
      }
    });

    // Update booking status to PAID (or COMPLETED if already in progress)
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" }
    });

    // Emit Socket notification
    await notificationService.notifyBookingStatus(bookingId, "PAID", { paymentId: payment.id });

    return res.json({
      message: "Payment processed successfully!",
      payment,
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
}
