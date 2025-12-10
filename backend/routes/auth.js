const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = "mysecret";

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (email, password, name) VALUES (?,?,?)`;

  db.run(sql, [email, hashed, name], function (err) {
    if (err) return res.json({ error: err.message });

    const token = jwt.sign({ id: this.lastID, email }, SECRET);
    res.json({ token });
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user.id, email }, SECRET);
    res.json({ token });
  });
});

module.exports = router;
