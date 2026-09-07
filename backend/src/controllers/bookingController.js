import prisma from "../prisma.js";
import { mapsService } from "../services/mapsService.js";
import { notificationService } from "../services/notificationService.js";

const SERVICE_RATES = {
  Electrical: 450,
  Plumbing: 400,
  Carpentry: 500,
  Painting: 600,
  Caregiving: 350,
  Gardening: 300,
  "Domestic Help": 300,
  Driving: 450
};

export async function createBooking(req, res) {
  try {
    const customerId = req.user.id;
    const { serviceCategory, lat, lng, address, scheduledAt } = req.body;

    if (!serviceCategory) {
      return res.status(400).json({ error: "Service category is required" });
    }

    const userLat = parseFloat(lat) || 23.0225;
    const userLng = parseFloat(lng) || 72.5714;
    const userAddress = address || (await mapsService.reverseGeocode(userLat, userLng));

    // Calculate base pricing & co-op 10% commission split
    const amount = SERVICE_RATES[serviceCategory] || 400;
    const commissionAmount = Math.round(amount * 0.1); // 10% Co-op federation fund
    const workerPayout = Math.round(amount * 0.9);      // 90% Worker earnings

    // Find all verified and available workers for this skill category
    const availableWorkers = await prisma.worker.findMany({
      where: {
        skillCategory: serviceCategory,
        verificationStatus: "APPROVED",
        isAvailable: true
      },
      include: {
        user: { select: { name: true, phone: true, email: true } },
        cooperative: { select: { name: true, federationName: true } }
      }
    });

    // Proximity matching using Haversine algorithm in mapsService
    const nearestWorkers = mapsService.findNearestWorkers(userLat, userLng, availableWorkers);
    const matchedWorker = nearestWorkers.length > 0 ? nearestWorkers[0] : null;

    const booking = await prisma.booking.create({
      data: {
        customerId,
        workerId: matchedWorker ? matchedWorker.id : null,
        serviceCategory,
        lat: userLat,
        lng: userLng,
        address: userAddress,
        scheduledAt: scheduledAt || "ASAP",
        amount,
        commissionAmount,
        workerPayout,
        status: "REQUESTED"
      },
      include: {
        worker: {
          include: {
            user: { select: { name: true, phone: true } },
            cooperative: { select: { name: true } }
          }
        }
      }
    });

    if (matchedWorker) {
      // Notify worker via Socket.io
      await notificationService.notifyWorkerNewJob(matchedWorker.id, booking);
    }

    return res.status(201).json({
      message: matchedWorker ? "Worker matched successfully!" : "Booking created! Searching for nearby worker...",
      booking,
      matchedWorker: matchedWorker ? {
        id: matchedWorker.id,
        name: matchedWorker.user.name,
        phone: matchedWorker.user.phone,
        ratingAvg: matchedWorker.ratingAvg,
        distanceKm: matchedWorker.distanceKm,
        cooperativeName: matchedWorker.cooperative.name
      } : null
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({ error: "Failed to create booking" });
  }
}

export async function acceptBooking(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const worker = await prisma.worker.findUnique({ where: { userId } });
    if (!worker) {
      return res.status(404).json({ error: "Worker profile not found" });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        workerId: worker.id,
        status: "ACCEPTED"
      },
      include: {
        customer: { select: { name: true, phone: true } },
        worker: { include: { user: { select: { name: true } } } }
      }
    });

    // Real-time socket notification to customer room
    await notificationService.notifyBookingStatus(id, "ACCEPTED", { workerName: worker.user?.name || "Worker" });

    return res.json({ message: "Booking accepted", booking: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to accept booking" });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // IN_PROGRESS, COMPLETED, CANCELLED

    if (!["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status state" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { customer: { select: { name: true, phone: true } } }
    });

    await notificationService.notifyBookingStatus(id, status);

    return res.json({ message: `Booking status updated to ${status}`, booking: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update booking status" });
  }
}

export async function rateBooking(req, res) {
  try {
    const { id } = req.params;
    const { stars, comment } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Stars rating must be between 1 and 5" });
    }

    const booking = await prisma.booking.findUnique({ where: { id }, include: { rating: true } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.rating) {
      return res.status(400).json({ error: "Booking has already been rated" });
    }

    const rating = await prisma.rating.create({
      data: {
        bookingId: id,
        stars: parseInt(stars),
        comment: comment || ""
      }
    });

    // Update worker average rating if worker assigned
    if (booking.workerId) {
      const allWorkerRatings = await prisma.rating.findMany({
        where: { booking: { workerId: booking.workerId } }
      });
      const avg = allWorkerRatings.reduce((acc, r) => acc + r.stars, 0) / allWorkerRatings.length;
      
      await prisma.worker.update({
        where: { id: booking.workerId },
        data: { ratingAvg: Math.round(avg * 10) / 10 }
      });
    }

    return res.json({ message: "Rating submitted successfully", rating });
  } catch (error) {
    console.error("Rate Booking Error:", error);
    return res.status(500).json({ error: "Failed to submit rating" });
  }
}

export async function getCustomerBookings(req, res) {
  try {
    const customerId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { customerId },
      include: {
        worker: {
          include: {
            user: { select: { name: true, phone: true } },
            cooperative: { select: { name: true } }
          }
        },
        payment: true,
        rating: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch customer bookings" });
  }
}

export async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { name: true, phone: true, email: true } },
        worker: {
          include: {
            user: { select: { name: true, phone: true } },
            cooperative: { select: { name: true, federationName: true } }
          }
        },
        payment: true,
        rating: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.json({ booking });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch booking details" });
  }
}

export async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.customerId !== customerId && req.user.role !== "FEDERATION_ADMIN") {
      return res.status(403).json({ error: "Unauthorized to cancel this booking" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    await notificationService.notifyBookingStatus(id, "CANCELLED");

    return res.json({ message: "Booking cancelled successfully", booking: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
}
