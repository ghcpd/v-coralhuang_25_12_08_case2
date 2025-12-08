const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/db');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Ensure tables
db.init();

app.get('/api/appointments', async (req, res) => {
  try {
    const rows = await db.listAppointments();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, datetime, notes, service } = req.body;
    const appt = await db.createAppointment({ name, email, phone, datetime, notes, service });
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Minimal Razorpay order creation - requires keys in env
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'rcpt_' + Date.now() } = req.body;
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
      return res.status(400).json({ error: 'Razorpay keys not configured. Set RAZORPAY_KEY and RAZORPAY_SECRET in .env' });
    }
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET });
    const order = await razorpay.orders.create({ amount: Math.round(amount), currency, receipt });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'payment error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Srimaata app listening on ${PORT}`));
