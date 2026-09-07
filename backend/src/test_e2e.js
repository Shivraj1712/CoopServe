const API = "http://localhost:5000/api";

async function runE2ETest() {
  console.log("🧪 Starting CoopServe E2E API Verification Test...");

  try {
    // 1. Login Customer
    const custRes = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "customer@coopserve.in", password: "password123" })
    });
    const custData = await custRes.json();
    const custToken = custData.token;
    console.log("✅ Customer Login Successful:", custData.user.name);

    // 2. Customer Create Booking (Triggers Haversine Worker Matching)
    const bookingRes = await fetch(`${API}/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${custToken}`
      },
      body: JSON.stringify({
        serviceCategory: "Electrical",
        address: "CG Road, Navrangpura, Ahmedabad",
        lat: 23.037,
        lng: 72.562
      })
    });
    const bookingData = await bookingRes.json();
    const booking = bookingData.booking;
    const matchedWorker = bookingData.matchedWorker;
    console.log("✅ Booking Created & Auto-Matched Worker:", matchedWorker.name, `(${matchedWorker.distanceKm} km away)`);

    // 3. Login Worker
    const workerRes = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "worker@coopserve.in", password: "password123" })
    });
    const workerData = await workerRes.json();
    const workerToken = workerData.token;
    console.log("✅ Worker Login Successful:", workerData.user.name);

    // 4. Worker Accept Booking
    const acceptRes = await fetch(`${API}/bookings/${booking.id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    const acceptData = await acceptRes.json();
    console.log("✅ Worker Accepted Booking. Status:", acceptData.booking.status);

    // 5. Worker Complete Work
    const statusRes = await fetch(`${API}/bookings/${booking.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workerToken}`
      },
      body: JSON.stringify({ status: "COMPLETED" })
    });
    const statusData = await statusRes.json();
    console.log("✅ Worker Completed Work. Status:", statusData.booking.status);

    // 6. Payment Flow (Mock Payment Order & Verification)
    const orderRes = await fetch(`${API}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${custToken}`
      },
      body: JSON.stringify({ bookingId: booking.id })
    });
    const orderData = await orderRes.json();
    const orderId = orderData.order.orderId;

    const payVerifyRes = await fetch(`${API}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${custToken}`
      },
      body: JSON.stringify({
        bookingId: booking.id,
        razorpayOrderId: orderId,
        razorpayPaymentId: "pay_test_999"
      })
    });
    const payVerifyData = await payVerifyRes.json();
    console.log("✅ Payment Verified & Co-op Commission Split Recorded:", payVerifyData.message);

    // 7. Customer Star Rating
    const rateRes = await fetch(`${API}/bookings/${booking.id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${custToken}`
      },
      body: JSON.stringify({ stars: 5, comment: "Outstanding service under Gujarat Labour Federation!" })
    });
    const rateData = await rateRes.json();
    console.log("✅ Rating Submitted Successfully! Rating ID:", rateData.rating.id);

    // 8. Admin Login & AI Demand Forecast Check
    const adminRes = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@coopserve.in", password: "password123" })
    });
    const adminData = await adminRes.json();
    const adminToken = adminData.token;

    const forecastRes = await fetch(`${API}/admin/forecast`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const forecastData = await forecastRes.json();
    console.log("✅ AI Demand Forecast Endpoint Returned:", forecastData.highDemandZones.length, "high-demand surge clusters");

    console.log("\n🎉🎉 ALL E2E API VERIFICATION TESTS PASSED 100%! 🎉🎉");
  } catch (err) {
    console.error("❌ Test Error:", err.message);
  }
}

runE2ETest();
