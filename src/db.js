const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'srimaata.sqlite');

let mode = 'sqlite';
let sqliteDb = null;
let pgPool = null;

async function initDb() {
  // if DATABASE_URL or PGHOST exists, use Postgres
  if (process.env.DATABASE_URL || process.env.PGHOST) {
    mode = 'postgres';
    const { Pool } = require('pg');
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
    // create table if not exists
    const create = `CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      service TEXT,
      notes TEXT,
      amount REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT now()
    )`;
    await pgPool.query(create);
    console.log('Using Postgres DB');
    return;
  }

  // default to sqlite
  mode = 'sqlite';
  const sqlite3 = require('sqlite3').verbose();
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  sqliteDb = new sqlite3.Database(DB_FILE, (err) => {
    if (err) return console.error('Failed to open DB', err);
    console.log('Opened sqlite DB at', DB_FILE);
  });

  const create = `CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    service TEXT,
    notes TEXT,
    amount REAL DEFAULT 0,
    created_at TEXT
  )`;
  sqliteDb.run(create);
}

async function getAllAppointments() {
  if (mode === 'postgres') {
    const res = await pgPool.query('SELECT * FROM appointments ORDER BY created_at DESC');
    return res.rows;
  }
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM appointments ORDER BY created_at DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function getAppointmentById(id) {
  if (mode === 'postgres') {
    const res = await pgPool.query('SELECT * FROM appointments WHERE id = $1', [id]);
    return res.rows[0];
  }
  return new Promise((resolve, reject) => {
    sqliteDb.get('SELECT * FROM appointments WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function createAppointment({ name, email, phone, date, time, service, notes, amount }) {
  if (mode === 'postgres') {
    const res = await pgPool.query(
      'INSERT INTO appointments (name,email,phone,date,time,service,notes,amount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [name, email, phone || '', date, time, service || '', notes || '', amount || 0]
    );
    return res.rows[0].id;
  }
  return new Promise((resolve, reject) => {
    const stmt = sqliteDb.prepare('INSERT INTO appointments (name,email,phone,date,time,service,notes,amount,created_at) VALUES (?,?,?,?,?,?,?,?,datetime("now"))');
    stmt.run([name, email, phone || '', date, time, service || '', notes || '', amount || 0], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

module.exports = { initDb, getAllAppointments, getAppointmentById, createAppointment };
