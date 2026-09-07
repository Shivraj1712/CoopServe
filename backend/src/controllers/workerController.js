import prisma from "../prisma.js";

export async function onboardWorker(req, res) {
  try {
    const userId = req.user.id;
    const { skillCategory, serviceArea, lat, lng, experienceYears, bio, cooperativeId } = req.body;

    if (!skillCategory || !serviceArea) {
      return res.status(400).json({ error: "Skill category and service area are required" });
    }

    // Get default cooperative if none provided
    let coopId = cooperativeId;
    if (!coopId) {
      const firstCoop = await prisma.cooperative.findFirst();
      coopId = firstCoop ? firstCoop.id : null;
    }

    if (!coopId) {
      return res.status(400).json({ error: "No cooperative available to join" });
    }

    const existing = await prisma.worker.findUnique({ where: { userId } });
    if (existing) {
      const updated = await prisma.worker.update({
        where: { userId },
        data: {
          skillCategory,
          serviceArea,
          lat: parseFloat(lat) || 23.0225,
          lng: parseFloat(lng) || 72.5714,
          experienceYears: parseInt(experienceYears) || 3,
          bio,
          cooperativeId: coopId,
          verificationStatus: "PENDING"
        }
      });
      return res.json({ message: "Worker profile updated (pending federation approval)", worker: updated });
    }

    const worker = await prisma.worker.create({
      data: {
        userId,
        cooperativeId: coopId,
        skillCategory,
        serviceArea,
        lat: parseFloat(lat) || 23.0225,
        lng: parseFloat(lng) || 72.5714,
        experienceYears: parseInt(experienceYears) || 3,
        bio,
        verificationStatus: "PENDING"
      }
    });

    return res.status(201).json({ message: "Worker onboarded successfully (pending federation approval)", worker });
  } catch (error) {
    console.error("Worker Onboarding Error:", error);
    return res.status(500).json({ error: "Server error during worker onboarding" });
  }
}

export async function toggleAvailability(req, res) {
  try {
    const userId = req.user.id;
    const { isAvailable } = req.body;

    const worker = await prisma.worker.findUnique({ where: { userId } });
    if (!worker) {
      return res.status(404).json({ error: "Worker profile not found" });
    }

    const updated = await prisma.worker.update({
      where: { userId },
      data: { isAvailable: Boolean(isAvailable) }
    });

    return res.json({ message: "Availability updated", isAvailable: updated.isAvailable });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update availability" });
  }
}

export async function getWorkerBookings(req, res) {
  try {
    const userId = req.user.id;
    const worker = await prisma.worker.findUnique({ where: { userId } });
    if (!worker) {
      return res.status(404).json({ error: "Worker profile not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { workerId: worker.id },
      include: { customer: { select: { name: true, phone: true, email: true } }, payment: true, rating: true },
      orderBy: { createdAt: "desc" }
    });

    // Earnings calculation (90% worker payout, 10% co-op commission)
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED" || b.status === "PAID");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.workerPayout || b.amount * 0.9), 0);
    const coopContribution = completedBookings.reduce((sum, b) => sum + (b.commissionAmount || b.amount * 0.1), 0);

    return res.json({
      worker,
      bookings,
      stats: {
        totalBookings: bookings.length,
        completedCount: completedBookings.length,
        totalEarnings,
        cooperativeFundContribution: coopContribution
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch worker bookings" });
  }
}
