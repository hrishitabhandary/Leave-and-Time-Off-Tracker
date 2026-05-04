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

### Users Table
- id (primary key)
- name
- email
- password
- role (employee/manager)

### Leaves Table
- id (primary key)
- user_id (foreign key)
- start_date
- end_date
- reason
- status (pending/approved/rejected)

---

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
