 // server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { hashSync, compareSync } from 'bcryptjs';
import sqlite3 from 'sqlite3';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

// DB helper functions
const get = (query, params, callback) => {
  db.get(query, params, callback);
};

const run = (query, params, callback) => {
  db.run(query, params, callback);
};

// Register route
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const email = username.trim().toLowerCase();

  get('SELECT * FROM users WHERE username = ?', [email], (err, row) => {
    if (err) {
      console.error('DB error on select:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) return res.status(400).json({ error: 'User already exists' });

    const hashed = hashSync(password, 10);
    run('INSERT INTO users (username, password) VALUES (?, ?)', [email, hashed], (err) => {
      if (err) {
        console.error('DB error on insert:', err);
        return res.status(500).json({ error: 'Failed to register user' });
      }
      res.status(201).json({ message: 'User registered' });
    });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  let { username, password } = req.body;
  username = username.trim().toLowerCase();

  get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('DB error on select:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Verify password
    if (!compareSync(password, row.password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
