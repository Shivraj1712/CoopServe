import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CoopServe Seed Script...");

  // Clean existing tables
  await prisma.rating.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.worker.deleteMany({});
  await prisma.cooperative.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Cooperative Federation
  const coop = await prisma.cooperative.create({
    data: {
      name: "Gujarat State Labour Co-operative Federation",
      federationName: "Gujarat Cooperative Federation",
      state: "Gujarat",
      city: "Ahmedabad"
    }
  });
  console.log(`✅ Created Cooperative: ${coop.name}`);

  // 2. Create Federation Admin
  const adminUser = await prisma.user.create({
    data: {
      name: "Ramesh Patel (Federation Officer)",
      email: "admin@coopserve.in",
      phone: "9825012345",
      passwordHash,
      role: "FEDERATION_ADMIN"
    }
  });
  console.log(`✅ Created Admin User: ${adminUser.email}`);

  // 3. Create Customers
  const customer1 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "customer@coopserve.in",
      phone: "9988776655",
      passwordHash,
      role: "CUSTOMER"
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Amitabh Shah",
      email: "amitabh@gmail.com",
      phone: "9876512345",
      passwordHash,
      role: "CUSTOMER"
    }
  });
  console.log(`✅ Created Demo Customers`);

  // 4. Create Skilled Workers
  const workerSeedData = [
    {
      name: "Rajesh Parmar",
      email: "worker@coopserve.in",
      phone: "9898011223",
      skillCategory: "Electrical",
      serviceArea: "Navrangpura & CG Road",
      lat: 23.037,
      lng: 72.562,
      verificationStatus: "APPROVED",
      ratingAvg: 4.9,
      experienceYears: 7,
      bio: "Certified Industrial & Home Electrician with 7+ years of experience under Gujarat Labour Co-op."
    },
    {
      name: "Suresh Solanki",
      email: "suresh.worker@coopserve.in",
      phone: "9898022334",
      skillCategory: "Plumbing",
      serviceArea: "SG Highway & Bodakdev",
      lat: 23.039,
      lng: 72.511,
      verificationStatus: "APPROVED",
      ratingAvg: 4.8,
      experienceYears: 5,
      bio: "Expert in pipe fitting, leak detection, and bath fixture installation."
    },
    {
      name: "Mahesh Vaghela",
      email: "mahesh.worker@coopserve.in",
      phone: "9898033445",
      skillCategory: "Carpentry",
      serviceArea: "Satellite & Anandnagar",
      lat: 23.013,
      lng: 72.514,
      verificationStatus: "APPROVED",
      ratingAvg: 4.7,
      experienceYears: 8,
      bio: "Custom furniture repair, door alignment, and cabinet installation specialist."
    },
    {
      name: "Dinesh Rathod",
      email: "dinesh.worker@coopserve.in",
      phone: "9898044556",
      skillCategory: "Painting",
      serviceArea: "Prahlad Nagar & Corporate Rd",
      lat: 23.003,
      lng: 72.502,
      verificationStatus: "APPROVED",
      ratingAvg: 4.9,
      experienceYears: 6,
      bio: "Interior texture painting and waterproof exterior coating."
    },
    {
      name: "Sunita Ben Chaudhari",
      email: "sunita.worker@coopserve.in",
      phone: "9898055667",
      skillCategory: "Caregiving",
      serviceArea: "Sector 11, Gandhinagar",
      lat: 23.215,
      lng: 72.636,
      verificationStatus: "APPROVED",
      ratingAvg: 5.0,
      experienceYears: 10,
      bio: "Compassionate elderly care, post-surgery assistance, and patient support."
    },
    {
      name: "Gautam Macwan",
      email: "gautam.worker@coopserve.in",
      phone: "9898066778",
      skillCategory: "Gardening",
      serviceArea: "Bodhakdev & Thaltej",
      lat: 23.05,
      lng: 72.505,
      verificationStatus: "APPROVED",
      ratingAvg: 4.6,
      experienceYears: 4,
      bio: "Lawn maintenance, terrace garden design, and organic plant trimming."
    },
    {
      name: "Kavita Ben Patel",
      email: "kavita.worker@coopserve.in",
      phone: "9898077889",
      skillCategory: "Domestic Help",
      serviceArea: "Vastrapur & IIM Road",
      lat: 23.033,
      lng: 72.53,
      verificationStatus: "APPROVED",
      ratingAvg: 4.8,
      experienceYears: 6,
      bio: "Full home deep cleaning, meal preparation, and household organization."
    },
    {
      name: "Vikram Sinh Zala",
      email: "vikram.worker@coopserve.in",
      phone: "9898088990",
      skillCategory: "Driving",
      serviceArea: "Ambawadi & Ellisbridge",
      lat: 23.02,
      lng: 72.55,
      verificationStatus: "APPROVED",
      ratingAvg: 4.9,
      experienceYears: 9,
      bio: "Professional personal & commercial vehicle driver with clean safety record."
    },

    // PENDING WORKERS (For Federation Admin Verification Queue Demo!)
    {
      name: "Pankaj Vankar",
      email: "pankaj.pending@coopserve.in",
      phone: "9898099001",
      skillCategory: "Electrical",
      serviceArea: "Maninagar & Kankaria",
      lat: 22.998,
      lng: 72.601,
      verificationStatus: "PENDING",
      ratingAvg: 5.0,
      experienceYears: 2,
      bio: "Newly joined co-op member awaiting document verification for electrical wiring."
    },
    {
      name: "Geeta Ben Solanki",
      email: "geeta.pending@coopserve.in",
      phone: "9898099002",
      skillCategory: "Caregiving",
      serviceArea: "Paldi & Vasna",
      lat: 23.01,
      lng: 72.555,
      verificationStatus: "PENDING",
      ratingAvg: 5.0,
      experienceYears: 3,
      bio: "Trained nursing assistant seeking verification under NCCT Gandhinagar co-op."
    }
  ];

  const createdWorkers = [];
  for (const wData of workerSeedData) {
    const user = await prisma.user.create({
      data: {
        name: wData.name,
        email: wData.email,
        phone: wData.phone,
        passwordHash,
        role: "WORKER"
      }
    });

    const worker = await prisma.worker.create({
      data: {
        userId: user.id,
        cooperativeId: coop.id,
        skillCategory: wData.skillCategory,
        serviceArea: wData.serviceArea,
        lat: wData.lat,
        lng: wData.lng,
        verificationStatus: wData.verificationStatus,
        ratingAvg: wData.ratingAvg,
        experienceYears: wData.experienceYears,
        bio: wData.bio,
        isAvailable: true
      }
    });
    createdWorkers.push(worker);
  }
  console.log(`✅ Created ${createdWorkers.length} Workers (8 Approved, 2 Pending Approval)`);

  // 5. Create Sample Historical Bookings & Ratings
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      workerId: createdWorkers[0].id, // Rajesh Parmar (Electrical)
      serviceCategory: "Electrical",
      address: "B-402, Samriddhi Apartments, CG Road, Navrangpura, Ahmedabad",
      lat: 23.037,
      lng: 72.562,
      amount: 450,
      commissionAmount: 45, // 10% Co-op fee
      workerPayout: 405,    // 90% Worker payout
      status: "PAID"
    }
  });

  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      razorpayOrderId: "ord_mock_seed101",
      razorpayPaymentId: "pay_mock_seed101",
      status: "SUCCESS",
      amount: 450
    }
  });

  await prisma.rating.create({
    data: {
      bookingId: booking1.id,
      stars: 5,
      comment: "Prompt service by Rajeshji! Fixed main circuit breaker safely and quickly."
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer2.id,
      workerId: createdWorkers[1].id, // Suresh Solanki (Plumbing)
      serviceCategory: "Plumbing",
      address: "12, Shanti Niketan Society, SG Highway, Bodakdev",
      lat: 23.039,
      lng: 72.511,
      amount: 400,
      commissionAmount: 40,
      workerPayout: 360,
      status: "COMPLETED"
    }
  });

  await prisma.rating.create({
    data: {
      bookingId: booking2.id,
      stars: 5,
      comment: "Great work under cooperative network. Very polite and professional."
    }
  });

  console.log(`✅ Created Sample Completed Bookings, Payments, and Ratings!`);
  console.log("🎉 Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
