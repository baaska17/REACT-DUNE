# Dune Tourist Camp - Management System

A full-stack web application for Dune Tourist Camp, featuring a customer booking site and a dedicated admin dashboard.

## 🚀 Tech Stack
- **Framework:** Next.js 15
- **Database:** SQLite with Prisma ORM
- **Styling:** CSS Modules / Global CSS
- **Icons:** Lucide React

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your machine.

### 2. Install Dependencies
Open your terminal in the project root and run:
```bash
npm install
```

### 3. Database Setup
The project uses SQLite. Initialize the database and generate the Prisma client:
```bash
npx prisma generate
npx prisma db push
```

---

## 🏃 How to Run the Application

This project is designed to run the **Client Website** and **Admin Dashboard** on separate ports simultaneously.

### Option A: Run Both (Recommended for Development)
To avoid file locking errors (`EBUSY`), use the following commands in **two separate terminal windows**:

**Terminal 1: Client Website (Port 3000)**
```powershell
$env:NEXT_DIST_DIR=".next-web"; npm run dev
```
*Access at: [http://localhost:3000](http://localhost:3000)*

**Terminal 2: Admin Dashboard (Port 3001)**
```powershell
$env:NEXT_DIST_DIR=".next-admin"; npx next dev -p 3001
```
*Access at: [http://localhost:3001](http://localhost:3001)*

> **Note for CMD users:** If you are using Command Prompt instead of PowerShell, use `set NEXT_DIST_DIR=.next-web && npm run dev` instead.

### Option B: Run Standard
If you only need the main website:
```bash
npm run dev
```

---

## 📂 Project Structure
- `/app`: Next.js App Router (Pages & API Routes)
- `/src/components`: Reusable UI components
- `/src/styles`: Page-specific CSS files
- `/public`: Static assets (Images, Icons)
- `/prisma`: Database schema and migrations

---

## 🔑 Key Features
- **Booking Engine:** Real-time price calculation based on check-in/out dates.
- **Admin Dashboard:** Manage rooms, restaurant menu, and horse riding activities.
- **Image Upload:** Upload images directly from the Admin panel.
- **Order Tracking:** Customers can track their orders using an ID (e.g., ORD-1).
- **Dark/Light Mode:** Full theme support across all pages.

---

## ⚠️ Troubleshooting
- **EBUSY Error:** If you see "resource busy or locked", ensure no other terminal is running the app and delete the `.next`, `.next-web`, or `.next-admin` folders manually.
- **OneDrive Sync:** If the project is in a OneDrive folder, sync issues can cause file locking. Pause OneDrive syncing if errors persist.
