# CoopServe — Cooperative Gig Services Platform

**Smart India Hackathon 2026 Submission**  
**Problem Statement ID**: 26089 | **Organization**: Ministry of Cooperation (NCCT) | **Theme**: Smart Automation

---

## Executive Summary

Labour Cooperative Federations have skilled workers (electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners) but no digital platform to connect them directly with customers. **CoopServe** bridges this gap with a cooperative-owned marketplace where federations verify workers, customers book services, and the entire flow—booking, geo-matching, real-time tracking, simple payment, rating, payout, and AI demand forecasting—runs seamlessly.

---

## System Architecture & Tech Stack

- **Frontend**: React.js (Vite), Material UI (MUI v5+), React Router DOM, Socket.io-client, Axios
- **Backend**: Node.js, Express.js, JWT Authentication, Socket.io (WebSockets)
- **Database**: SQLite with Prisma ORM (`dev.db` - **Zero Docker / Zero PostgreSQL installation required**)
- **Service Layer Abstractions (Phase 1 Mocked / Phase 2 Ready)**:
  - `paymentService.js`: Mocked payment modal & order generation (Phase 2 Razorpay swap ready)
  - `mapsService.js`: Proximity matching via Haversine distance formula on seeded lat/lng (Phase 2 Google Maps swap ready)
  - `notificationService.js`: Real-time WebSocket event emission & console logs (Phase 2 Firebase FCM push swap ready)
- **Mobile Packaging**: Capacitor config (`capacitor.config.json`) included for Android & iOS native shells.

---

## ⚡ Quick Start Guide (Zero External Credentials Needed)

### 1. Backend Setup & Database Seeding

```bash
cd backend

# Install backend dependencies
npm install

# Push Prisma schema to local SQLite database (dev.db)
npx prisma db push

# Seed database with realistic demo data (1 Cooperative, 10 Workers, 5 Customers, Completed Bookings)
npm run db:seed

# Start backend server on Port 5000
npm start
```

### 2. Frontend Setup & Run

Open a new terminal window:

```bash
cd frontend

# Install frontend dependencies
npm install

# Run Vite dev server (runs on http://localhost:3001 or 3000)
npm run dev
```

Visit **`http://localhost:3001`** (or `http://localhost:3000`) in your web browser.

---

## 🎭 Live Demo Walkthrough Script (3-Minute Presentation for SIH Judges)

To present a flawless demo during judging:

1. **Auth & Persona Quick-Switching**:
   - Open `http://localhost:3001/login`.
   - Highlight the **"⚡ HACKATHON LIVE DEMO"** quick-switch cards on the login page or the **"Switch Role"** button in the navbar.

2. **Step 1: Customer Booking & Geo-Matching (Login as Customer)**:
   - Click **"Customer"** persona button (Logs in as *Priya Sharma*).
   - Click **"Electrical"** service card -> Review pricing (₹450 / visit) -> Click **"Confirm & Auto-Match Worker"**.
   - Notice the instant **Haversine Proximity Match** card showing nearby verified worker *Rajesh Parmar* (0 km away, 4.9⭐ rating under *Gujarat State Labour Co-op*).
   - Observe the live **Status Stepper** transition to `Requested`.

3. **Step 2: Worker Duty Acceptance & Execution (Switch to Worker)**:
   - Click **"Switch Role"** in navbar -> Select **"Demo Worker (Rajesh)"**.
   - Observe the live **Job Alert Card** for Electrical Service.
   - Click **"Accept Job Request"** -> Status updates to `ACCEPTED` in real time via Socket.io.
   - Click **"Start Work at Location"** -> Status updates to `IN_PROGRESS`.
   - Click **"Complete Work"** -> Status updates to `COMPLETED`.
   - Review the **Worker Earnings Ledger**: ₹405 Net Worker Payout (90%) + ₹45 Cooperative Reserve Contribution (10%).

4. **Step 3: Customer Payment & Rating (Switch to Customer)**:
   - Switch back to **"Customer"** persona.
   - Click **"Pay ₹450"** on the completed booking.
   - The **CoopServe Simple Payment Modal** appears showing the 90% worker vs 10% co-op fee breakdown. Click **"Pay ₹450"**.
   - Watch the animated payment success checkmark.
   - Click **"Rate Service"** -> Submit a 5-star rating with feedback.

5. **Step 4: Federation Admin Dashboard & AI Demand Forecast (Switch to Admin)**:
   - Switch to **"Federation Admin (Ramesh)"**.
   - View overview KPI cards: **Total Workers**, **Co-op Reserve Fund (10%)**, **Gross Revenue**, and **Total Bookings**.
   - Click **"Worker Verification Queue"** tab -> See pending workers (*Pankaj Vankar*) -> Click **"Approve"** for instant verification.
   - Click **"Bookings & Payout Ledger"** -> Review the complete transparent transaction split.
   - Click **"AI Demand Forecast"** tab -> View predicted peak-hour demand bars and high-demand surge cluster cards (*SG Highway*, *Navrangpura*).

---

## 🔌 Phase 1 (Mocked) vs Phase 2 (Real Credentials Swap)

| Service | Phase 1 (Built & Runnable Now) | Phase 2 (Ready to Swap) |
|---|---|---|
| **Database** | SQLite (`dev.db` via Prisma ORM) | PostgreSQL (Change `DATABASE_URL` in `.env`) |
| **Payments** | Interactive MUI Payment Modal | Real Razorpay SDK (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) |
| **Maps & Proximity** | Haversine distance formula on seeded lat/lng | Google Maps Distance Matrix API (`GOOGLE_MAPS_API_KEY`) |
| **Notifications** | WebSocket (Socket.io) + Console log | Firebase Cloud Messaging (`FIREBASE_CREDENTIALS_PATH`) |

All Phase 2 placeholder variables are documented in `backend/.env.example` and `frontend/.env.example`.

---

## 📱 Mobile App Packaging (Capacitor)

The repository includes a pre-configured `frontend/capacitor.config.json`. To build an installable Android / iOS APK:

```bash
cd frontend
npm run build
npx cap add android
npx cap copy
npx cap open android
```

---

## 💡 Key Highlights for Hackathon Evaluation

- **Cooperative Empowerment**: 90% direct worker payout + 10% transparent federation welfare fund.
- **Real-Time State Sync**: WebSockets update customer and worker views synchronously without page refreshes.
- **Smart Automation**: AI demand forecasting highlights surge clusters for cooperative labor deployment.
- **Demoware Polish**: Custom MUI Theme, rounded cards, loading spinners, snackbar toasts, and one-click quick-switch demo personas.
# CoopServe
