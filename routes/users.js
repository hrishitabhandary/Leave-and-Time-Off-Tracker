const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all users
router.get('/', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all managers only
router.get('/managers', (req, res) => {
  try {
    const managers = db.prepare(`SELECT * FROM users WHERE role = 'manager'`).all();
    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single user by id
router.get('/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leave balance for a user
router.get('/:id/balance', (req, res) => {
  try {
    const leaveTypes = db.prepare('SELECT * FROM leave_types').all();
    
    const balance = leaveTypes.map(lt => {
      const used = db.prepare(`
        SELECT COALESCE(SUM(working_days), 0) as used
        FROM leave_requests
        WHERE user_id = ? AND leave_type_id = ? AND status = 'approved'
      `).get(req.params.id, lt.id);

      return {
        leave_type: lt.name,
        yearly_quota: lt.yearly_quota,
        used: used.used,
        remaining: lt.yearly_quota - used.used
      };
    });

    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;