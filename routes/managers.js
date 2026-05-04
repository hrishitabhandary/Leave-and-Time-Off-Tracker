const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all pending requests for a manager
router.get('/:manager_id/requests', (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT lr.*, u.name as employee_name, u.department,
             lt.name as leave_type_name
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.manager_id = ?
    `;
    const params = [req.params.manager_id];

    if (status) { query += ' AND lr.status = ?'; params.push(status); }
    query += ' ORDER BY lr.created_at DESC';

    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a leave request
router.patch('/:manager_id/requests/:leave_id/approve', (req, res) => {
  try {
    const { manager_comment } = req.body;
    const { manager_id, leave_id } = req.params;

    const leave = db.prepare('SELECT * FROM leave_requests WHERE id = ? AND manager_id = ?')
      .get(leave_id, manager_id);

    if (!leave) return res.status(404).json({ error: 'Request not found' });
    if (leave.status !== 'pending') return res.status(400).json({ error: 'Only pending requests can be approved' });

    db.prepare(`
      UPDATE leave_requests
      SET status = 'approved', manager_comment = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(manager_comment || null, leave_id);

    res.json({ message: '✅ Leave approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject a leave request
router.patch('/:manager_id/requests/:leave_id/reject', (req, res) => {
  try {
    const { manager_comment } = req.body;
    const { manager_id, leave_id } = req.params;

    const leave = db.prepare('SELECT * FROM leave_requests WHERE id = ? AND manager_id = ?')
      .get(leave_id, manager_id);

    if (!leave) return res.status(404).json({ error: 'Request not found' });
    if (leave.status !== 'pending') return res.status(400).json({ error: 'Only pending requests can be rejected' });

    db.prepare(`
      UPDATE leave_requests
      SET status = 'rejected', manager_comment = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(manager_comment || null, leave_id);

    res.json({ message: '✅ Leave rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;