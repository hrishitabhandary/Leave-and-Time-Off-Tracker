# Leave and Time Off Tracker - Architecture

## 1. Overview
This is a full-stack Leave and Time Off Tracking system that allows employees to apply for leave and managers to approve or reject requests.

The system is designed using a simple, scalable architecture focusing on separation of frontend, backend, and database layers.

---

## 2. Tech Stack

### Frontend
- React.js
- Bootstrap / CSS
- React Router

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- SQLite (local file-based database)

---

## 3. System Architecture

Frontend (React)
    ↓ API Calls
Backend (Express Server)
    ↓
Database (SQLite)

---

## 4. Database Schema

Database Schema (SQLite) 
The project uses SQLite (better-sqlite3) as the database engine.

It contains 3 main tables:

- users → Stores employees and managers
- leave_types → Stores leave categories and yearly quotas
- leave_requests → Stores all leave applications with approval workflow

## 5. API Endpoints

### Auth
- POST /login
- POST /signup

### Leaves
- POST /leave → create leave request
- GET /leaves → fetch all leaves
- PUT /leave/:id → update leave status

### Users
- GET /users → fetch users

---

## 6. Component Structure (Frontend)

- Login Page
- Signup Page
- Dashboard
- Leave Request Form
- Manager Panel

---

## 7. Key Features

- User authentication
- Role-based access (Employee / Manager)
- Leave request submission
- Approval / rejection workflow
- Simple dashboard view

---

## 8. What I Would Improve With More Time

- Add JWT authentication
- Add role-based route protection
- Deploy backend (Render / Railway)
- Deploy frontend (Vercel)
- Improve UI/UX design
- Add pagination and filters
