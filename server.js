const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const { initDb, getDb } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// expose minimal runtime config for the frontend (safe values only)
app.get('/api/config', (req, res) => {
  res.json({ RAZORPAY_KEY: process.env.RZP_KEY_ID || '' });
});

app.get('/api/appointments', async (req, res) => {
  try {
    const rows = await require('./src/db').getAllAppointments();
    res.json({ appointments: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, date, time, service, notes, amount } = req.body;

    if (!name || !email || !date || !time) return res.status(400).json({ error: 'Missing required fields (name,email,date,time required)' });

    // basic validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (phone && !/^[0-9+\-\s]{6,20}$/.test(phone)) return res.status(400).json({ error: 'Invalid phone format' });

    const { createAppointment } = require('./src/db');
    const id = await createAppointment({ name, email, phone, date, time, service, notes, amount });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const { getAppointmentById } = require('./src/db');
    const row = await getAppointmentById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Placeholder payment route - creates Razorpay order if keys are configured
app.post('/api/payment/create-order', async (req, res) => {
  const Razorpay = require('razorpay');
  const { amount, currency = 'INR', receipt } = req.body;
  if (!process.env.RZP_KEY_ID || !process.env.RZP_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay keys not configured on server (RZP_KEY_ID/RZP_KEY_SECRET)' });
  }

  if (!amount) return res.status(400).json({ error: 'amount required' });

  const instance = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });
  try {
    const order = await instance.orders.create({ amount: Math.round(amount * 100), currency, receipt: receipt || `rcpt_${Date.now()}` });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// make sure DB exists and start server
initDb();

app.listen(PORT, () => {
  console.log(`Srimaata server running — http://localhost:${PORT}`);
});
