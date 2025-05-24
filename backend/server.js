 // server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { hashSync, compareSync } from 'bcryptjs';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Create users table if not exists
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log('✅ PostgreSQL connected and users table ensured.');
  } catch (error) {
    console.error('❌ DB init error:', error);
  }
};
initDB();

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const email = username.trim().toLowerCase();

  try {
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = hashSync(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [email, hashed]);

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('DB error on register:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  let { username, password } = req.body;
  username = username.trim().toLowerCase();

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    if (!compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('DB error on login:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
