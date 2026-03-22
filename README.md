# Mini CRM — Client Lead Management System

![Demo](./demo.gif)

> A production-ready CRM system to manage leads, track their pipeline status, add follow-up notes, and analyze conversion performance — built with the MERN stack.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Database Schema](#database-schema)
- [Security](#security)
- [What I Learned](#what-i-learned)
- [Future Improvements](#future-improvements)

---

## Overview

Mini CRM is a full-stack web application that helps businesses manage incoming leads from website contact forms. When a visitor submits a form, the lead is stored in the database and becomes immediately visible in the admin dashboard — where it can be tracked, followed up on, and converted.

**The system solves a real business problem:** most small agencies and freelancers lose leads because they have no structured way to track them. This CRM provides that structure.

---

## Live Demo

> 🔗 [minicrm.vercel.app](https://minicrm.vercel.app) *(replace with your deployed URL)*

**Demo credentials:**
```
Email:    admin@minicrm.com
Password: admin123
```

---

## Features

### Core
- **Public contact form** — Visitors submit leads without needing an account
- **Admin dashboard** — Analytics overview with 7 interactive charts
- **Lead management** — Full CRUD with search, filter, pagination
- **Status pipeline** — Track leads through New → Contacted → Converted
- **Notes & follow-ups** — Add timestamped notes to each lead
- **Profile & settings** — Update name, email, and password

### Analytics (Dashboard)
- KPI stat cards with 6-month sparklines
- Sales pipeline funnel with drop-off rates
- Cumulative lead growth (area chart)
- Status trends over time (multi-line chart)
- Monthly conversion rate trend
- Performance radar chart
- Live activity timeline

### Export & Data
- **Export PDF** — Full dashboard report with tables and pipeline visualization
- **Export CSV** — Download filtered leads as a spreadsheet
- **Add lead manually** — Create leads directly from the admin panel (for phone/email leads)

### UI/UX
- Light and dark mode with system preference detection
- Fully responsive — mobile, tablet, and desktop
- Animated transitions and page entrances (Framer Motion)
- Toast notifications for all actions
- Skeleton loading states

### Security
- JWT authentication with 7-day expiry
- Bcrypt password hashing (salt rounds: 10)
- Protected routes — all admin routes require a valid token
- CORS restricted to frontend origin

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Recharts | Data visualization |
| Axios | HTTP client with JWT interceptor |
| jsPDF + jspdf-autotable | PDF generation |
| React Hot Toast | Notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| JSON Web Tokens | Authentication |
| Bcryptjs | Password hashing |
| dotenv | Environment config |
| CORS | Cross-origin control |

---

## Project Structure

```
FUTURE_FS_02/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── db.js                 # MongoDB connection
│   ├── 📁 controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   └── leadController.js     # Lead CRUD + notes
│   ├── 📁 middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── 📁 models/
│   │   ├── User.js               # Admin user schema
│   │   └── Lead.js               # Lead + notes schema
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   └── leadRoutes.js
│   ├── seed.js                   # Sample data generator
│   ├── server.js                 # Entry point
│   └── .env                      # Environment variables
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── axios.js          # Axios instance + interceptor
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx   # Global auth state
│   │   │   └── ThemeContext.jsx  # Light/dark mode
│   │   ├── 📁 pages/
│   │   │   ├── LandingPage.jsx   # Public contact form
│   │   │   ├── LoginPage.jsx     # Admin login
│   │   │   ├── DashboardPage.jsx # Analytics overview
│   │   │   ├── LeadsPage.jsx     # Lead table + filters
│   │   │   ├── LeadDetailPage.jsx# Lead detail + notes
│   │   │   └── ProfilePage.jsx   # Settings
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── demo.gif
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-crm
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected: localhost
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Create your admin account

With the backend running, make a POST request to register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@minicrm.com", "password": "admin123"}'
```

Or use Postman / Thunder Client with:
```
POST http://localhost:5000/api/auth/register
Body: { "name": "Admin", "email": "admin@minicrm.com", "password": "admin123" }
```

### 5. Seed sample data (optional)

To populate the database with 80–100 realistic leads spread across 6 months:

```bash
cd backend
node seed.js
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/mini-crm` |
| `JWT_SECRET` | Secret key for JWT signing | `any_long_random_string` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Reference

### Auth Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create admin account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update name/email/password |

### Lead Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/leads` | Public | Submit a new lead (contact form) |
| GET | `/api/leads/count` | Public | Get total lead count |
| GET | `/api/leads` | Private | Get all leads |
| GET | `/api/leads/:id` | Private | Get single lead |
| PATCH | `/api/leads/:id/status` | Private | Update lead status |
| PATCH | `/api/leads/:id/notes` | Private | Add a note to a lead |
| DELETE | `/api/leads/:id` | Private | Delete a lead |

### Authentication

All private routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Requests

**Submit a lead (public):**
```json
POST /api/leads
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+91 98765 43210",
  "source": "instagram"
}
```

**Update lead status:**
```json
PATCH /api/leads/:id/status
{
  "status": "contacted"
}
```

**Add a note:**
```json
PATCH /api/leads/:id/notes
{
  "text": "Called the lead — interested in the enterprise plan"
}
```

---

## Database Schema

### User
```js
{
  name:      String (required),
  email:     String (required, unique),
  password:  String (hashed with bcrypt),
  role:      String (enum: ["admin"], default: "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Lead
```js
{
  name:       String (required),
  email:      String (required),
  phone:      String,
  source:     String (default: "website form"),
  status:     String (enum: ["new", "contacted", "converted"]),
  assignedTo: ObjectId (ref: User),
  notes: [{
    text:      String,
    addedBy:   ObjectId (ref: User),
    createdAt: Date
  }],
  createdAt:  Date,
  updatedAt:  Date
}
```

---

## Security

| Measure | Implementation |
|---|---|
| Password hashing | bcryptjs with salt rounds: 10 |
| Authentication | JWT tokens with 7-day expiry |
| Route protection | Express middleware validates JWT on all private routes |
| CORS | Restricted to `CLIENT_URL` environment variable only |
| Input safety | Mongoose schema validation on all fields |

---

## Data Flow

```
Visitor fills contact form
        ↓
POST /api/leads  (public — no auth)
        ↓
Lead saved to MongoDB
        ↓
Admin logs in → JWT issued
        ↓
GET /api/leads  (private — JWT required)
        ↓
Admin views leads → updates status → adds notes
        ↓
Lead converted → reflected in dashboard analytics
```

---

## What I Learned

Building this project gave me hands-on experience with:

- **Full-stack data flow** — how data moves from a public form through a REST API into a database and back to a dashboard
- **JWT authentication** — stateless auth, token storage, and protecting routes on both frontend and backend
- **React Context API** — managing global state for auth and theme without external libraries
- **Axios interceptors** — automatically attaching auth tokens to every API request
- **Data visualization** — transforming raw lead data into meaningful charts using Recharts
- **PDF generation** — building structured documents from data using jsPDF
- **Real business logic** — thinking about the product from a business owner's perspective, not just a developer's

---

## Future Improvements

- [ ] Kanban board view with drag-and-drop status changes
- [ ] Follow-up reminders with due dates
- [ ] Ctrl+K global search command palette
- [ ] Lead tags and priority levels
- [ ] In-app notification bell
- [ ] API rate limiting with `express-rate-limit`
- [ ] Request validation with `zod`
- [ ] Sales team role with assigned leads
- [ ] Email notifications via SendGrid

---

<p align="center">Built with ❤️ as a portfolio project — something I can confidently say: <br><em>"I built this system to manage real clients."</em></p>
