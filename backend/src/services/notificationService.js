/**
 * Notification Service Abstraction Layer
 * 
 * PHASE 1 (Current): Console logs + Socket.io event emissions for real-time UI updates.
 * PHASE 2 (Future): Swap in Firebase Cloud Messaging (FCM) admin SDK for mobile push alerts.
 */

import { getIO } from "../socket.js";

export const notificationService = {
  /**
   * Send notification to customer about booking status update
   */
  async notifyBookingStatus(bookingId, status, payload = {}) {
    console.log(`[NOTIFICATION SERVICE] Booking ${bookingId} status -> ${status}`);
    
    // Emit Socket.io event to room "booking_<id>"
    try {
      const io = getIO();
      if (io) {
        io.to(`booking_${bookingId}`).emit("booking_status_updated", {
          bookingId,
          status,
          timestamp: new Date().toISOString(),
          ...payload
        });
        // Also broadcast to admin room
        io.to("admin_room").emit("admin_booking_updated", { bookingId, status, ...payload });
      }
    } catch (err) {
      console.warn("[SOCKET NOTIFY WARN]", err.message);
    }

    /* PHASE 2 TODO: Firebase FCM Push Notification
    await firebaseAdmin.messaging().sendToDevice(customerDeviceToken, {
      notification: { title: "Booking Update", body: `Your booking is now ${status}` },
      data: { bookingId, status }
    });
    */
  },

  /**
   * Send job alert to worker
   */
  async notifyWorkerNewJob(workerId, bookingData) {
    console.log(`[NOTIFICATION SERVICE] Job Alert sent to Worker ${workerId}`);
    try {
      const io = getIO();
      if (io) {
        io.to(`worker_${workerId}`).emit("new_job_assigned", bookingData);
      }
    } catch (err) {
      console.warn("[SOCKET WORKER NOTIFY WARN]", err.message);
    }
  }
};
