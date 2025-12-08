require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { initDb, addAppointment, getAppointments } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

initDb();

// Create an appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, message, date, time, amount } = req.body;
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'name, email, date and time are required' });
    }
    const id = await addAppointment({ name, email, message, date, time, amount: amount || 0 });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// List appointments (simple admin endpoint)
app.get('/api/appointments', async (req, res) => {
  try {
    const rows = await getAppointments();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// Razorpay order creation (requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in env)
app.post('/api/create-order', async (req, res) => {
  try {
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    const { amount } = req.body;
    if (!razorpayKey || !razorpaySecret) {
      return res.status(500).json({ error: 'Razorpay keys not configured (see .env.example)' });
    }
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecret });
    const order = await rzp.orders.create({ amount: Math.round(Number(amount) * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create order' });
  }
});

app.listen(PORT, () => {
  console.log(`Srimaata server running on port ${PORT}`);
});