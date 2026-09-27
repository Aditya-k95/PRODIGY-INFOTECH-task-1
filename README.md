# Prodigy InfoTech — Task 1: Secure User Authentication System

A modern, full-stack **User Authentication & Authorization System** built with **React (Vite)** on the frontend and **Node.js (Express) + SQLite** on the backend. It features secure JWT authentication, bcrypt password hashing, persistent session management, role-based access control (RBAC), protected frontend routes, and independent backend endpoint verification.

---

## 🚀 Features

- **🔐 Secure Registration**: Name, email, and password validation with duplicate email prevention and bcrypt password hashing (10 salt rounds).
- **🔑 Secure Login & Session Handling**: Issues JSON Web Tokens (JWT) signed with HS-256 algorithm and provides safe error feedback.
- **🛡️ Protected Routes & API Guards**:
  - Frontend protected route guards automatically redirect unauthenticated users to `/login`.
  - Backend API middleware independently verifies the `Authorization: Bearer <token>` header on every protected request.
- **👑 Role-Based Access Control (RBAC)**:
  - Standard `user` role (access to personal dashboard, profile customization, and API verification).
  - `admin` role (access to user registry, database stats, and admin management console).
- **💾 Persistent State**: Restores authenticated sessions on browser refresh/reloads; provides clean logout removing stored credentials.
- **👤 Profile Management**: Authenticated users can update their display name, bio, and change their password with current password verification.
- **📡 Live Protected API Verification Console**: Built-in interactive tester on the dashboard to trigger live HTTP requests to `/api/dashboard/summary` and view raw server headers and payloads.
- **🎨 Humanized, Responsive UI/UX**: Clean aesthetic, eye toggle for password fields, real-time password strength meter, and quick one-click demo login buttons.

---

## 📁 Project Structure

```text
PRODIGY-INFOTECH-task-1/
├── backend/
│   ├── config/
│   │   └── db.js               # SQLite database setup, query helpers & auto-seed
│   ├── controllers/
│   │   ├── authController.js   # Register, login, getMe, updateProfile, changePassword
│   │   └── dashboardController.js # Protected metrics & admin registry
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification & RBAC authorization
│   ├── models/
│   │   └── userModel.js        # SQL user operations & database methods
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── dashboardRoutes.js  # /api/dashboard protected routes
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PasswordStrengthMeter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state & persistent session provider
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx  # Admin user registry & metrics
│   │   │   ├── Dashboard.jsx   # Main authenticated dashboard & API tester
│   │   │   ├── Login.jsx       # Login with demo quick-fill
│   │   │   ├── NotFound.jsx    # 404 page
│   │   │   ├── Profile.jsx     # Profile editor & password change
│   │   │   └── Register.jsx    # User registration with validation
│   │   ├── services/
│   │   │   └── api.js          # Centralized fetch wrapper with JWT interceptor
│   │   ├── App.jsx             # React router configuration
│   │   ├── index.css           # Modern CSS design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── vercel.json                 # Vercel deployment configuration
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Start development server (runs on http://localhost:5000)
npm run dev
# or
npm start
```

### 2. Frontend Setup

```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server (runs on http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Credentials

The database automatically seeds two test accounts upon initialization:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin User** | `admin@example.com` | `Admin@1234` | Full access, user directory, system metrics |
| **Standard User** | `demo@example.com` | `User@1234` | Personal dashboard, profile customization |

*(You can also click the quick-fill demo buttons on the Login page to populate these instantly)*

---

## 🛡️ API Endpoints Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server status and health check |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Protected (JWT) | Rehydrate and retrieve current user session |
| `PUT` | `/api/auth/profile` | Protected (JWT) | Update full name and bio |
| `PUT` | `/api/auth/change-password` | Protected (JWT) | Update password with old password verification |
| `GET` | `/api/dashboard/summary` | Protected (JWT) | Dashboard metrics and protected quote |
| `GET` | `/api/dashboard/admin/users` | Protected (`admin` role) | Retrieve full user directory and system analytics |

---

## 🔒 Security Practices Implemented

1. **Password Hashing**: Passwords are never stored in plain text. Salted with 10 rounds using `bcryptjs`.
2. **JWT Session Management**: Tokens are signed with secret keys, verified on every request, and set to expire.
3. **Safe Error Messages**: Generic error responses prevent email enumeration during failed logins.
4. **Input Sanitization & Validation**: Email regex formatting and password length restrictions enforced on both client and server.
5. **Role-Based Guards**: Protected backend routes independently check user role before serving sensitive data.
6. **Graceful Error Recovery**: Automatically purges invalid/expired tokens upon encountering HTTP 401 responses.
