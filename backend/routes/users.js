// backend/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const SECRET = "mysecret";

// simple auth middleware (expects Authorization header: token)
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get current user profile (id, email, name, salary)
router.get('/me', auth, (req, res) => {
  db.get('SELECT id, email, name, salary FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

// Get salary
router.get('/salary', auth, (req, res) => {
  db.get('SELECT salary FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ salary: row ? row.salary : 0 });
  });
});

// Update salary
router.put('/salary', auth, (req, res) => {
  const { salary } = req.body;
  const val = Number(salary) || 0;
  db.run('UPDATE users SET salary = ? WHERE id = ?', [val, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

module.exports = router;
