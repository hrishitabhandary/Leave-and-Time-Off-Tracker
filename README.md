# 🗂️ Leave and Time Off Tracker

A full-stack Leave Management System that allows employees to apply for leave, managers to approve/reject requests, and teams to track availability via a calendar view.

---

## 🚀 Live Demo
👉 Video Demo: https://youtu.be/sb4VBt4bbKs

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- React Router

### Backend:
- Node.js
- Express.js
- REST APIs

### Database:
- SQLite

---

## ✨ Core Functionalities

### 1. Leave Application Form
- Leave types: **Sick / Casual / Work From Home / Comp-off**
- Fields:
  - Start date
  - End date
  - Reason
  - Manager selection (3 predefined managers)
- Auto-calculates working days (excludes weekends)
- All inputs validated on server-side (no trust in client data)

---

### 2. Employee Dashboard
- Displays:
  - Leave balance per type
  - Leave history
  - Pending requests
- Filters:
  - Status (Pending / Approved / Rejected)
  - Date range filtering

---

### 3. Manager View
- Shows all leave requests assigned to the manager
- Actions:
  - Approve leave
  - Reject leave (with optional comment)
- Audit trail includes:
  - Timestamp
  - Manager name who approved/rejected

---

### 4. Team Calendar
- Visual calendar of leaves
- Shows who is on leave this week and next week
- Filter by leave type
- Helps avoid scheduling conflicts and overlaps

---

### 5. REST API
- Clean RESTful API design
- Fully independent of frontend (works with Postman/cURL)
- Proper HTTP status codes
- Server-side validation enforced for all requests

Example endpoints:
- `GET /api/users`
- `GET /api/leaves`
- `POST /api/leaves`
- `PUT /api/leaves/:id`

---

### 6. Database Design
- SQLite database with clean schema design:
  - Users table (employees & managers)
  - Leave requests table
  - Leave types with yearly quotas
  - Audit trail for approvals/rejections

### Seed Data:
- 20 users
- 3 managers
- 25–30 realistic leave requests with mixed statuses and date ranges

---

