// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, 'db.sqlite');

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('SQLite Database Connected!');
});

db.serialize(() => {
  // Create users table (if not exists)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  )`);

  // Ensure 'salary' column exists; if not, add it
  db.all("PRAGMA table_info(users)", (err, cols) => {
    if (err) return console.error(err);
    const hasSalary = cols && cols.some(c => c.name === 'salary');
    if (!hasSalary) {
      db.run("ALTER TABLE users ADD COLUMN salary REAL DEFAULT 0", (err) => {
        if (err) console.error("Failed to add salary column:", err.message);
        else console.log("Added salary column to users table (default 0).");
      });
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT,
    amount REAL,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
