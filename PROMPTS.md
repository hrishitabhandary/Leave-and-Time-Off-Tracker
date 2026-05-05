# 🤖 PROMPTS.md — AI Usage Log

This document logs how I used Claude (claude.ai) to assist in building 
the Leave & Time Off Tracker during the technical assignment.

---

## Prompt 1 — Project Planning
**What I asked:**
I have a fullstack intern assignment to build a Leave and Time Off Tracker 
with React, Node.js and SQLite. 20 employees, 3 managers, 25 leave requests. 
Give me a 3 hour battle plan to finish it.

**What Claude helped with:**
- Broke down the project into backend-first approach
- Suggested SQLite over PostgreSQL for zero setup time
- Created a time-boxed plan: DB schema → seed → routes → frontend pages

---

## Prompt 2 — Database Schema Design
**What I asked:**
Design a clean SQLite schema for a leave tracking system with users, 
leave types with yearly quotas, and leave requests with approval workflow.

**What Claude helped with:**
- Designed 3 tables: users, leave_types, leave_requests
- Added proper foreign key relationships
- Added status CHECK constraint (pending/approved/rejected)
- Added created_at and updated_at timestamps for audit trail

---

## Prompt 3 — Seed Data
**What I asked:**
Write a seed.js file with 20 realistic Indian employees, 3 managers across 
Engineering/Design/Operations departments, and 25 leave requests with 
mixed statuses and date ranges.

**What Claude helped with:**
- Generated realistic Indian names for all 23 users
- Created leave requests across different statuses and date ranges
- Used UUID for all primary keys
- Added manager comments for approved/rejected requests

---

## Prompt 4 — Backend API Routes
**What I asked:**
Write Express.js routes for: getting leave balance per type, applying for 
leave with server-side validation, manager approve/reject with comments, 
and team calendar for this week and next week.

**What Claude helped with:**
- Built working days calculator excluding weekends
- Added server-side validation (empty fields, date order, weekend-only check)
- Built calendar endpoint filtering by current and next week
- Used proper HTTP status codes (200, 201, 400, 404, 500)

---

## Prompt 5 — React App Structure
**What I asked:**
Set up a React Vite app with React Router, Tailwind CSS v4, and a user 
switcher dropdown to simulate login without auth. 4 pages: Dashboard, 
ApplyLeave, ManagerView, Calendar.

**What Claude helped with:**
- Configured Tailwind v4 with @tailwindcss/vite plugin
- Set up React Router with all 4 routes
- Built user switcher dropdown at top to switch between employee/manager
- Manager View link only shows when logged in user is a manager

---

## Prompt 6 — Employee Dashboard
**What I asked:**
Build a responsive employee dashboard showing leave balance cards per type 
with progress bars, leave history table with filters by status and date range.

**What Claude helped with:**
- Built 4 colored balance cards with progress bars
- Added status and date range filters
- Table view on desktop, card view on mobile
- Fetch balance and history from backend API

---

## Prompt 7 — Leave Application Form
**What I asked:**
Build a leave application form with leave type dropdown showing remaining 
balance, manager dropdown, date pickers with auto working days calculation, 
reason textarea and proper error/success messages.

**What Claude helped with:**
- Auto-calculates working days live as user picks dates
- Shows remaining days in leave type dropdown
- Displays error from server-side validation
- Resets form on successful submission

---

## Prompt 8 — Manager View
**What I asked:**
Build a manager view with a table of leave requests, filter tabs for 
pending/approved/rejected, and approve/reject buttons that open a modal 
for optional comment before confirming.

**What Claude helped with:**
- Built filter tabs (Pending/Approved/Rejected/All)
- Modal popup for adding comment before approve/reject
- Shows lock screen for non-manager users
- Card view on mobile, table on desktop

---

## Prompt 9 — Team Calendar
**What I asked:**
Build a team calendar showing who is on leave this week and next week 
with a grid showing each day, red dot for on leave, green for present, 
filter by leave type.

**What Claude helped with:**
- Built week day generator for this week and next week
- Grid with red/green indicators per day per employee
- Leave type filter dropdown
- Mobile card view showing date ranges instead of grid

---

## Prompt 10 — Dark Mode UI
**What I asked:**
Convert the entire app to dark mode with a professional look. 
Background #0f0f0f, cards #1a1a1a, borders #2a2a2a, white text. 
Centered max-width layout for desktop.

**What Claude helped with:**
- Applied consistent dark theme across all pages and components
- Used inline styles for precise color control
- Status badges with colored backgrounds (green/red/amber)
- Centered max-w-6xl layout for desktop

---

## Summary

| Area | AI Assisted | Self Written |
|---|---|---|
| DB Schema | ✅ Claude suggested | Reviewed & approved |
| Seed Data | ✅ Claude generated | Added Indian context |
| Backend Routes | ✅ Claude scaffolded | Tested via browser |
| Frontend Pages | ✅ Claude built | Customized styling |
| Dark Mode UI | ✅ Claude applied | Color choices mine |
| Git & Docs | ✅ Claude guided | Written by me |

**Total prompts used:** ~20+ across the 3 hour session
**Tool used:** Claude (claude.ai) — chat interface
