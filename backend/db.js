 import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./users.db');

// Set busy timeout to wait before throwing SQLITE_BUSY error
db.configure('busyTimeout', 5000);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

export const get = (query, params, callback) => {
  db.serialize(() => {
    db.get(query, params, callback);
  });
};

export const run = (query, params, callback) => {
  db.serialize(() => {
    db.run(query, params, callback);
  });
};
