# 🔥 BlazeFire Arena — Free Fire Tournament Platform

India's most trusted Free Fire tournament registration and management platform.

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Node.js
Download and install from: **https://nodejs.org** (LTS version)

> After installing, restart your terminal/PowerShell.

### Step 2: Install Dependencies

Open a terminal in `c:\Users\aalok\project\tournament\` and run:

```sh
# Frontend
npm install

# Backend
cd backend && npm install && cd ..
```

### Step 3: Configure Firebase

1. Go to **[Firebase Console](https://console.firebase.google.com)**
2. Create a new project → Enable **Google Authentication**
3. Enable **Firestore** (test mode initially)
4. Go to **Project Settings** → **Your Apps** → Add Web App
5. Copy the credentials into a `.env` file (see below)

**Create `.env` in the project root:**
```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

Fill in all the `VITE_FIREBASE_*` values from Firebase Console.

### Step 4: Run the App

```sh
# Terminal 1 — Frontend (Vite dev server)
npm run dev

# Terminal 2 — Backend (Express API)
cd backend && node server.js
```

Visit **http://localhost:5173** to see BlazeFire Arena!

---

## 🏆 Features

| Feature | Status |
|---|---|
| Google Sign-In | ✅ Complete |
| Free Fire UID Linking | ✅ Complete |
| Tournament Browsing + Filters | ✅ Complete |
| Real-time Slot Tracking | ✅ Complete |
| Countdown Timers | ✅ Complete |
| Registration Flow (5 steps) | ✅ Complete |
| Fampay Payment Integration | ✅ Complete (activate with API key) |
| Gift Card System | ✅ Complete |
| Redeem Code System | ✅ Complete |
| Wallet Payments | ✅ Complete |
| Admin Login (JWT protected) | ✅ Complete |
| Admin Dashboard (8 tabs) | ✅ Complete |
| Tournament Creation | ✅ Complete |
| Participant Management + CSV | ✅ Complete |
| Room ID Release | ✅ Complete |
| Push Notifications (FCM) | ✅ Complete |
| Leaderboard | ✅ Complete |
| Responsive (Mobile-first) | ✅ Complete |

---

## 🔐 Admin Panel

Navigate to: **http://localhost:5173/admin**

Default credentials (change in `.env`):
- Username: `blazefire_admin`
- Password: `BF@Secure2025!`

---

## 💳 Payment Setup (Fampay)

1. Register at https://fampay.in/business
2. Get your API key from the merchant dashboard
3. Add to your `.env`:
   ```
   FAMPAY_API_KEY=your_key_here
   FAMPAY_MERCHANT_ID=your_merchant_id
   ```
4. Uncomment the Fampay API call in `backend/routes/payment.js`

---

## 📱 Build for Production

```sh
npm run build  # Creates optimized dist/ folder
firebase deploy  # Deploy to Firebase Hosting
```

---

## 🏗️ Project Structure

```
tournament/
├── src/
│   ├── components/
│   │   ├── admin/       # AdminLogin, AdminDashboard
│   │   ├── auth/        # FreefireIDModal, ProtectedRoute
│   │   ├── home/        # Hero, Features, HowItWorks, etc.
│   │   ├── layout/      # Navbar, Footer, Layout
│   │   ├── tournament/  # TournamentCard, RegistrationModal
│   │   └── ui/          # Button, Modal, Toast, Timer, etc.
│   ├── constants/       # gameRules, adminConfig
│   ├── hooks/           # useAuth, useTournaments
│   ├── pages/           # HomePage, TournamentsPage, etc.
│   ├── services/        # Firebase services
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   └── utils/           # formatters, validators
└── backend/
    ├── routes/          # admin.js, payment.js, tournament.js
    ├── middleware/      # JWT auth
    └── server.js
```

---

## ⚠️ Legal Notice

This platform is for skill-based competitions. Please ensure compliance with local laws regarding online competitions in your region.
