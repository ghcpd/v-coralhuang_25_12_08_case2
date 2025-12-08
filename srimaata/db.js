const sqlite3 = require('sqlite3');
const path = require('path');
const DB_PATH = path.join(__dirname, 'data', 'srimaata.db');
const fs = require('fs');

function ensureDataDir() {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

function initDb() {
  ensureDataDir();
  const db = new sqlite3.Database(DB_PATH);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      amount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
  db.close();
}

function addAppointment({ name, email, message, date, time, amount = 0 }) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    const stmt = db.prepare(`INSERT INTO appointments (name,email,message,date,time,amount) VALUES (?,?,?,?,?,?)`);
    stmt.run([name, email, message, date, time, amount], function (err) {
      stmt.finalize();
      db.close();
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

function getAppointments() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all(`SELECT * FROM appointments ORDER BY created_at DESC`, (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { initDb, addAppointment, getAppointments };
