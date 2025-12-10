const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET = "mysecret";

// Middleware
function verify(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.json({ error: "No token" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.json({ error: "Invalid token" });
  }
}

// Get transactions
router.get('/', verify, (req, res) => {
  db.all(
    `SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.json({ error: err.message });
      res.json(rows);
    }
  );
});

// Add transaction
router.post('/', verify, (req, res) => {
  const { description, amount } = req.body;

  db.run(
    `INSERT INTO transactions (user_id, description, amount, date) VALUES (?,?,?,datetime('now'))`,
    [req.user.id, description, amount],
    function (err) {
      if (err) return res.json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Delete transaction
router.delete('/:id', verify, (req, res) => {
  db.run(
    `DELETE FROM transactions WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
    function (err) {
      if (err) return res.json({ error: err.message });
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;
