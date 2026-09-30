# LibNexus — Library Discovery & Seat Booking Platform

LibNexus is a full-stack, production-ready Library Discovery & Seat Reservation Management platform built with **React (Vite)**, **TailwindCSS**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 🚀 Key Features

- **Interactive Library Discovery**: Browse partner libraries with real-time seat counts, operating hours, amenities, ratings, and filters.
- **Visual Seat Reservation Map**: Real-time grid-based seat map supporting zones (Quiet Zone, Reading Room, Computer Lab, Group Study) and amenity filters (Power Outlets, Window View) with double-booking prevention.
- **Leaflet City Map**: Interactive map powered by CartoDB Voyager tiles showing library pins and instant navigation.
- **Cross-Library Book Catalog**: Search and filter physical books across partner libraries.
- **JWT Authentication & RBAC**: Secure user authentication with support for `user`, `librarian`, and `admin` roles, including 1-click demo login buttons.
- **Personal User Dashboard**: Track active seat reservations, view ticket entry passes, and cancel bookings.
- **Comprehensive Admin Panel**: Management interface for platform stats, libraries CRUD, catalog CRUD, seat maintenance toggles, and user account governance.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, TailwindCSS, Lucide Icons, Leaflet / React-Leaflet, Axios
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT (JSON Web Tokens), bcryptjs, CORS
- **Tooling & Orchestration**: Concurrently, Docker Compose

---

## 📋 Prerequisites

- **Node.js** `v18.x` or higher
- **npm** `v9.x` or higher
- **MongoDB** running locally on port `27017` or via Docker

---

## ⚡ Quickstart Guide

### 1. Install Dependencies

Install root, backend, and frontend dependencies:

```bash
npm run setup
```

*(or run `npm install` in root, `backend/`, and `frontend/`)*

### 2. Configure Environment Variables

Create `.env` inside `backend/` (or copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/libnexus
JWT_SECRET=libnexus_super_secret_jwt_key_2026
NODE_ENV=development
```

### 3. Start MongoDB Database

Using Docker Compose:

```bash
docker compose up -d
```

*Or ensure local MongoDB service is active on `mongodb://127.0.0.1:27017`.*

### 4. Seed Database (Manual)

Populate the database with 6 libraries, 120 books, 216 seats, demo bookings, and demo accounts:

```bash
npm run seed
```

### 5. Launch Full-Stack Application

Run both the Express backend (`http://localhost:5000`) and React frontend (`http://localhost:5173`):

```bash
npm run dev
```

---

## 🔑 Demo Login Credentials

You can use the 1-click demo login buttons on the Login page or log in using these accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **System Admin** | `admin@libnexus.com` | `Admin@123` | Full Admin Panel (`/admin`), Libraries, Books, Seats, Users CRUD |
| **Librarian Staff** | `librarian@libnexus.com` | `Librarian@123` | Library & Catalog Management |
| **Standard User** | `user@libnexus.com` | `User@123` | Seat Reservations & User Dashboard |

---

## 📡 REST API Endpoint Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user profile | Protected |
| `GET` | `/api/libraries` | List libraries with search/filters | Public |
| `GET` | `/api/libraries/:id` | Get library details & hours | Public |
| `GET` | `/api/books` | Search catalog with filters | Public |
| `GET` | `/api/books/:id` | Get book details & holding library | Public |
| `GET` | `/api/seats/library/:libraryId` | Get library seat layout | Public |
| `GET` | `/api/seats/library/:libraryId/availability` | Check real-time seat availability | Public |
| `POST` | `/api/bookings` | Create seat reservation | Protected |
| `GET` | `/api/bookings/my-bookings` | List user's active/past bookings | Protected |
| `PUT` | `/api/bookings/:id/cancel` | Cancel seat booking | Protected |
| `GET` | `/api/admin/stats` | System metrics telemetry | Admin |
| `GET` | `/api/admin/users` | List platform users | Admin |
| `PUT` | `/api/admin/users/:id/role` | Update user role | Admin |
| `POST` | `/api/admin/libraries` | Create new library | Admin |
| `PUT` | `/api/admin/libraries/:id` | Update library details | Admin |
| `DELETE` | `/api/admin/libraries/:id` | Delete library | Admin |
| `POST` | `/api/admin/books` | Add book to catalog | Admin |
| `PUT` | `/api/admin/books/:id` | Edit book details | Admin |
| `DELETE` | `/api/admin/books/:id` | Delete book | Admin |
| `PUT` | `/api/admin/seats/:id/status` | Toggle seat status (e.g. maintenance) | Admin |

---

## 📂 Project Structure

```
LibraryNexus/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (Mongoose)
│   │   ├── controllers/     # Express controllers (Auth, Library, Book, Seat, Booking, Admin)
│   │   ├── middleware/      # Auth JWT protection & global error handler
│   │   ├── models/          # Mongoose schemas (User, Library, Book, Seat, Booking)
│   │   ├── routes/          # API route definitions
│   │   ├── seed/            # Manual database seeder script
│   │   └── server.js        # Express server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Footer, SeatGrid, MapView, Cards)
│   │   ├── context/         # AuthContext provider
│   │   ├── layouts/         # MainLayout and AdminLayout
│   │   ├── pages/           # Landing, Discovery, Details, Booking, Catalog, Map, Auth, Dashboard, Admin
│   │   ├── services/        # Axios API clients
│   │   ├── styles/          # Tailwind index.css
│   │   ├── App.jsx          # Router configuration
│   │   └── main.jsx         # Vite entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml
├── package.json             # Root runner script
└── README.md
```
