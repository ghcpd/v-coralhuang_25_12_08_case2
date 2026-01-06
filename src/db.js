const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'srimaata'}`
});

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        service TEXT,
        datetime TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
  } finally {
    client.release();
  }
}

async function createAppointment({ name, email, phone, service, datetime, notes }) {
  const res = await pool.query(
    `INSERT INTO appointments (name, email, phone, service, datetime, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [name, email, phone, service, datetime || null, notes || null]
  );
  return res.rows[0];
}

async function listAppointments() {
  const res = await pool.query(`SELECT * FROM appointments ORDER BY created_at DESC`);
  return res.rows;
}

module.exports = { init, createAppointment, listAppointments, pool };
