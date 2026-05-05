# 🏗️ Architecture — Leave & Time Off Tracker

## 1. Overview
A full-stack Leave and Time Off Tracking system where employees can apply 
for leave and managers can approve or reject requests. Built in under 3 hours 
using AI-assisted development with Claude.

---

## 2. Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS v4
- React Router DOM

### Backend
- Node.js
- Express.js
- REST API

### Database
- SQLite via better-sqlite3 (file-based, zero config)

---

## 3. System Architecture

```text
Browser (React + Vite)
        ↓ HTTP fetch()
Express Server (Node.js) → Port 5000
        ↓
SQLite Database (leave_tracker.db)
```

No auth layer — user switching is simulated via dropdown 
for demo purposes. JWT + role-based auth would be added in production.

---

## 4. Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | TEXT | UUID primary key |
| name | TEXT | Full name |
| email | TEXT | Unique |
| role | TEXT | 'employee' or 'manager' |
| department | TEXT | Engineering, Design, Operations |

### leave_types
| Column | Type | Notes |
|---|---|---|
| id | TEXT | UUID primary key |
| name | TEXT | Sick, Casual, WFH, Comp-off |
| yearly_quota | INTEGER | Max days per year |

### leave_requests
| Column | Type | Notes |
|---|---|---|
| id | TEXT | UUID primary key |
| user_id | TEXT | FK → users |
| manager_id | TEXT | FK → users |
| leave_type_id | TEXT | FK → leave_types |
| start_date | TEXT | YYYY-MM-DD |
| end_date | TEXT | YYYY-MM-DD |
| working_days | INTEGER | Weekends excluded |
| reason | TEXT | Employee's reason |
| status | TEXT | pending/approved/rejected |
| manager_comment | TEXT | Optional manager note |
| created_at | TEXT | Timestamp |
| updated_at | TEXT | Timestamp |

---

## 5. API Endpoints

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users | Get all users |
| GET | /api/users/managers | Get managers only |
| GET | /api/users/:id | Get single user |
| GET | /api/users/:id/balance | Get leave balance per type |

### Leaves
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/leaves | Get all leaves (filterable) |
| GET | /api/leaves/calendar | Team calendar this+next week |
| POST | /api/leaves | Apply for leave |
| DELETE | /api/leaves/:id | Cancel pending leave |

### Managers
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/managers/:id/requests | Get requests for manager |
| PATCH | /api/managers/:id/requests/:lid/approve | Approve leave |
| PATCH | /api/managers/:id/requests/:lid/reject | Reject leave |

---

## 6. Frontend Structure

```text
App.jsx → User switcher + routing
├── Dashboard.jsx     → Leave balance cards + history table + filters
├── ApplyLeave.jsx    → Leave form with working days auto-calc
├── ManagerView.jsx   → Approve/reject table with comment modal
└── Calendar.jsx      → Team calendar this week + next week

Components:
├── Navbar.jsx        → Responsive nav with hamburger menu
└── LeaveCard.jsx     → Mobile card view for leave requests
```

---

## 7. Key Design Decisions

- **SQLite over PostgreSQL** — Zero setup time, perfect for a 20-person internal tool. Would migrate to PostgreSQL for scale.
- **No auth** — Simulated via user dropdown for demo. JWT + middleware would be added in production.
- **Working days calc on both client and server** — Client shows preview, server validates to prevent manipulation.
- **Responsive design** — Cards on mobile, tables on desktop using Tailwind breakpoints.
- **Seed script** — Clears and repopulates DB with 20 employees, 3 managers, 25 realistic leave requests.

---

## 8. What I Would Add With More Time

- JWT authentication + protected routes
- Role-based middleware on backend
- Email notifications on approve/reject
- Pagination for large datasets
- Deploy backend on Render, frontend on Vercel
- Unit tests for API endpoints
