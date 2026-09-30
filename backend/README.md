# LibNexus REST API Backend

Clean Node.js + Express.js + MongoDB backend for the LibraryNexus smart library platform.

## Features
- **JWT Authentication & Role-Based Access Control**: `user`, `librarian`, `admin`.
- **Library Discovery & Geolocation**: Distance calculation using Haversine algorithm (`GET /api/libraries/nearby`).
- **Book Catalog Engine**: Category, search, and library filtering (`GET /api/books`).
- **Seat Occupancy & Reservation**: Interactive status management with double-booking prevention (`POST /api/bookings`).
- **Admin Management API**: Dashboard statistics, library/book/seat/user CRUD (`/api/admin`).

## Setup & Running

```bash
cd backend
npm install
npm run seed  # Manual database seed
npm run dev   # Start dev server on port 5000
```
