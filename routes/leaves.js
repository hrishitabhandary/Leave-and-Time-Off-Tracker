const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// Helper: calculate working days (exclude weekends)
const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

// Get all leave requests (with filters)
router.get('/', (req, res) => {
  try {
    const { user_id, status, start_date, end_date } = req.query;
    let query = `
      SELECT lr.*, u.name as employee_name, u.department,
             m.name as manager_name, lt.name as leave_type_name
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      JOIN users m ON lr.manager_id = m.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE 1=1
    `;
    const params = [];

    if (user_id) { query += ' AND lr.user_id = ?'; params.push(user_id); }
    if (status) { query += ' AND lr.status = ?'; params.push(status); }
    if (start_date) { query += ' AND lr.start_date >= ?'; params.push(start_date); }
    if (end_date) { query += ' AND lr.end_date <= ?'; params.push(end_date); }

    query += ' ORDER BY lr.created_at DESC';

    const leaves = db.prepare(query).all(...params);
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaves for this week and next week (for team calendar)
router.get('/calendar', (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const endOfNextWeek = new Date(startOfWeek);
    endOfNextWeek.setDate(startOfWeek.getDate() + 13);

    const start = startOfWeek.toISOString().split('T')[0];
    const end = endOfNextWeek.toISOString().split('T')[0];

    const leaves = db.prepare(`
      SELECT lr.*, u.name as employee_name, u.department, lt.name as leave_type_name
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.status = 'approved'
      AND lr.start_date <= ? AND lr.end_date >= ?
      ORDER BY lr.start_date ASC
    `).all(end, start);

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply for leave
router.post('/', (req, res) => {
  try {
    const { user_id, manager_id, leave_type_id, start_date, end_date, reason } = req.body;

    // Server side validation
    if (!user_id || !manager_id || !leave_type_id || !start_date || !end_date || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: 'Start date cannot be after end date' });
    }
    if (reason.trim().length < 5) {
      return res.status(400).json({ error: 'Reason is too short' });
    }

    const working_days = calculateWorkingDays(start_date, end_date);
    if (working_days === 0) {
      return res.status(400).json({ error: 'Selected dates fall on weekends only' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO leave_requests (id, user_id, manager_id, leave_type_id, start_date, end_date, working_days, reason, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
    `).run(id, user_id, manager_id, leave_type_id, start_date, end_date, working_days, reason);

    res.status(201).json({ message: '✅ Leave applied successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a leave request
router.delete('/:id', (req, res) => {
  try {
    const leave = db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave request not found' });
    if (leave.status !== 'pending') return res.status(400).json({ error: 'Only pending requests can be deleted' });

    db.prepare('DELETE FROM leave_requests WHERE id = ?').run(req.params.id);
    res.json({ message: '✅ Leave request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;