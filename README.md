# 🗂️ Leave and Time Off Tracker

A full-stack Leave Management System that allows employees to apply for leave, managers to approve/reject requests, and teams to track availability via a calendar view.

---

👉 Video Demo: https://youtu.be/n8-bcNR53DA
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


## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

---

### 1. Clone the Repository
```bash
git clone https://github.com/hrishitabhandary/Leave-and-Time-Off-Tracker.git
cd leave-tracker (as per your file path)
```

### 2. Setup Backend
```bash
cd backend (as per your file path)
npm install
node db/seed.js
npm run dev
```
Backend runs on → http://localhost:5000

### 3. Setup Frontend
Open a new terminal:
```bash
cd frontend (as per your file path)
npm install
npm run dev
```
Frontend runs on → http://localhost:5173

---

## 🧪 Test API via curl

### Get all users
```bash
curl http://localhost:5000/api/users
```

### Get leave balance for a user
```bash
curl http://localhost:5000/api/users/{user_id}/balance
```

### Apply for leave
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "your-user-id",
    "manager_id": "manager-id",
    "leave_type_id": "leave-type-id",
    "start_date": "2026-05-10",
    "end_date": "2026-05-11",
    "reason": "Personal work"
  }'
```

### Get manager requests
```bash
curl http://localhost:5000/api/managers/{manager_id}/requests
```

### Approve a leave
```bash
curl -X PATCH http://localhost:5000/api/managers/{manager_id}/requests/{leave_id}/approve \
  -H "Content-Type: application/json" \
  -d '{"manager_comment": "Approved!"}'
```

### Reject a leave
```bash
curl -X PATCH http://localhost:5000/api/managers/{manager_id}/requests/{leave_id}/reject \
  -H "Content-Type: application/json" \
  -d '{"manager_comment": "Critical deadline"}'
```

### Team calendar
```bash
curl http://localhost:5000/api/leaves/calendar
```

---

## 🗂️ Project Structure
leave-tracker/
├── backend/
│   ├── db/
│   │   ├── database.js      # SQLite setup & schema
│   │   └── seed.js          # Seed 20 users + 25 leave requests
│   ├── routes/
│   │   ├── users.js         # User & balance endpoints
│   │   ├── leaves.js        # Leave CRUD endpoints
│   │   └── managers.js      # Approve/reject endpoints
│   └── server.js            # Express entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── LeaveCard.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ApplyLeave.jsx
│   │   │   ├── ManagerView.jsx
│   │   │   └── Calendar.jsx
│   │   └── App.jsx
└── README.md 
