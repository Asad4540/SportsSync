# 🏆 SportSync — Sports Tournament Registration Portal

A full-stack MERN web application for managing inter-college sports tournament registrations. Built as a final year college project with modern UI, JWT authentication, admin dashboard, and scalable architecture.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Default Credentials](#-default-credentials)
- [API Endpoints](#-api-endpoints)
- [Modules Overview](#-modules-overview)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control (User/Admin)
- 🏏 **Multiple Sports** — Cricket, Football, Volleyball, Badminton, Chess
- 📝 **Team Registration** with dynamic team members and payment screenshot upload
- 📊 **User Dashboard** — Track registration status (Pending/Approved/Rejected)
- 🛡️ **Admin Dashboard** — Manage tournaments, registrations, and announcements
- 🗺️ **Venue Maps** — Interactive Leaflet.js maps for tournament venues
- 📢 **Announcements** — Admin-managed notices with priority levels
- 📜 **PDF Certificates** — Auto-generated participation certificates for approved teams
- 📱 **Responsive Design** — Mobile-first dark theme with Tailwind CSS
- ✅ **Form Validation** — React Hook Form with real-time error feedback

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js 19 | UI library |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS v3 | Utility-first styling |
| Axios | HTTP client |
| Context API | State management |
| React Hook Form | Form handling & validation |
| React-Leaflet | Interactive venue maps |
| React Icons (HeroIcons) | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js v5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| Bcrypt.js | Password hashing |
| Multer | File upload (payment screenshots) |
| PDFKit | Certificate PDF generation |

---

## 📁 Project Structure

```
SportSync/
├── backend/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Register, Login, Profile
│   │   ├── tournamentController.js   # Tournament CRUD
│   │   ├── registrationController.js # Team registration & status
│   │   ├── announcementController.js # Announcement CRUD
│   │   └── certificateController.js  # PDF certificate generation
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification
│   │   └── adminMiddleware.js        # Admin role check
│   ├── models/
│   │   ├── User.js                   # User schema (with roles)
│   │   ├── Tournament.js             # Tournament schema
│   │   ├── Registration.js           # Registration schema
│   │   └── Announcement.js           # Announcement schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tournamentRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── announcementRoutes.js
│   │   └── certificateRoutes.js
│   ├── uploads/                      # Payment screenshot storage
│   ├── seed.js                       # Database seeder
│   ├── server.js                     # Express app entry point
│   ├── .env                          # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js     # Auth guard
│   │   │   ├── AdminRoute.js         # Admin guard
│   │   │   └── common/
│   │   │       ├── LoadingSpinner.js
│   │   │       ├── StatusBadge.js
│   │   │       └── ConfirmModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js        # Auth state management
│   │   ├── layouts/
│   │   │   ├── MainLayout.js         # User layout (navbar + sidebar)
│   │   │   └── AdminLayout.js        # Admin layout
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── public/
│   │   │   │   ├── Home.js           # Landing page
│   │   │   │   └── Sports.js         # Browse tournaments
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── TournamentDetail.js
│   │   │   │   ├── RegisterTeam.js
│   │   │   │   ├── MyRegistrations.js
│   │   │   │   └── Profile.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── ManageTournaments.js
│   │   │       ├── TournamentForm.js
│   │   │       ├── ManageRegistrations.js
│   │   │       ├── RegistrationDetail.js
│   │   │       └── ManageAnnouncements.js
│   │   ├── services/
│   │   │   └── api.js                # Axios instance & API calls
│   │   ├── App.js                    # Router configuration
│   │   ├── App.css                   # Tailwind directives
│   │   └── index.js                  # Entry point
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 📦 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) — [Download](https://www.mongodb.com/try/download/community)
- **Git** — [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Asad4540/React-CRUD.git
cd React-CRUD
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` folder (if not already present):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tournament_registration_app
JWT_SECRET=super_secret_jwt_key_for_development
```

> 💡 For **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.

### 4. Seed the Database

```bash
node seed.js
```

This creates:
- ✅ Admin user (`admin@gmail.com` / `Admin@123`)
- ✅ 5 sample tournaments (Cricket, Football, Volleyball, Badminton, Chess)
- ✅ 3 sample announcements

### 5. Start the Backend Server

```bash
npm start
```

The API will be available at `http://localhost:5000/api`

### 6. Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/tournament_registration_app` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_jwt_key_for_development` |

---

## 👤 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@gmail.com` | `Admin@123` |

> New users can register at `/register` and will be assigned the **user** role.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET | `/api/auth/profile` | Protected | Get current user profile |
| PUT | `/api/auth/profile` | Protected | Update profile |
| GET | `/api/auth/users` | Admin | Get all users |

### Tournaments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tournaments` | Public | List all tournaments (supports `?sport=`, `?status=`, `?search=`) |
| GET | `/api/tournaments/:id` | Public | Get tournament by ID |
| POST | `/api/tournaments` | Admin | Create tournament |
| PUT | `/api/tournaments/:id` | Admin | Update tournament |
| DELETE | `/api/tournaments/:id` | Admin | Delete tournament |

### Registrations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/registrations` | Protected | Register team (multipart/form-data) |
| GET | `/api/registrations/my` | Protected | Get user's registrations |
| GET | `/api/registrations` | Admin | Get all registrations (supports `?status=`, `?search=`, `?tournament=`) |
| GET | `/api/registrations/:id` | Protected | Get registration by ID |
| PUT | `/api/registrations/:id/status` | Admin | Approve/Reject registration |
| DELETE | `/api/registrations/:id` | Admin | Delete registration |

### Announcements
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/announcements` | Public | List all announcements |
| POST | `/api/announcements` | Admin | Create announcement |
| PUT | `/api/announcements/:id` | Admin | Update announcement |
| DELETE | `/api/announcements/:id` | Admin | Delete announcement |

### Certificates
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/certificates/:registrationId` | Protected | Download participation certificate (PDF) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

---

## 🧩 Modules Overview

### 1. 🔐 Authentication Module
- User registration and login with JWT tokens
- Password hashing using Bcrypt
- Protected routes (frontend & backend)
- Role-based access control (User / Admin)

### 2. 🏅 Sports Module
- Displays 5 sports: Cricket, Football, Volleyball, Badminton, Chess
- Each sport shows rules, venue, team size, fees, tournament date
- Filterable listing (All / Upcoming / Ongoing / Completed)

### 3. 📝 Tournament Registration Module
- Multi-field registration form with React Hook Form validation
- Dynamic team members (add/remove)
- Payment screenshot upload via Multer
- Duplicate registration prevention
- Deadline and slot limit enforcement

### 4. 📊 User Dashboard Module
- Welcome greeting with user stats
- Registration count cards (Total, Approved, Pending, Rejected)
- Recent registrations list
- Quick action links
- Latest announcements sidebar

### 5. 🛡️ Admin Dashboard Module
- Aggregate statistics (Tournaments, Registrations, Users, Announcements)
- Recent registrations table
- Quick access to management pages

### 6. 🏆 Tournament Management Module
- Full CRUD operations for tournaments
- Set registration deadlines and max participants
- Update tournament status (Upcoming / Ongoing / Completed)
- Venue coordinates for map display

### 7. 🗺️ Venue & Maps Module
- Interactive Leaflet.js maps on tournament detail pages
- OpenStreetMap tiles (free, no API key required)
- Venue address and coordinate display

### 8. 📢 Announcement Module
- Admin can create, edit, and delete announcements
- Priority levels: Low, Medium, High
- Displayed on user dashboard and landing page

### 9. 📜 Certificate Module
- PDF participation certificates generated via PDFKit
- Available only for approved registrations
- Professional design with team name, sport, venue, and date
- Download button on My Registrations page

### 10. 📱 Responsive UI & UX
- Dark theme with glassmorphism design
- Tailwind CSS utility-first styling
- Collapsible sidebar for mobile devices
- Loading spinners and toast notifications
- Smooth animations and hover effects

---

## 🖼️ Screenshots

### Landing Page
The public landing page with hero section, stats, upcoming tournaments, and announcements.

### Login Page
Split-screen login with branding panel and demo credentials display.

### User Dashboard
Stats cards, recent registrations, quick actions, and announcements sidebar.

### Sports & Tournaments
Filterable tournament cards with slot progress bars and key details.

### Admin Dashboard
Overview stats with tournament, registration, user, and announcement counts.

### Admin — Manage Tournaments
Table view with add, edit, delete actions for all tournaments.

### Admin — Manage Registrations
Searchable table with approve/reject/delete actions and status filters.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Asad** — [GitHub](https://github.com/Asad4540)

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>
