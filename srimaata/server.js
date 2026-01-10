const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/appointments', (req, res) => {
  const rows = db.getAllAppointments();
  res.json(rows);
});

app.post('/api/appointments', (req, res) => {
  const { name, email, phone, date, time, notes } = req.body;
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = db.createAppointment({ name, email, phone, date, time, notes });
  res.json({ id });
});

// Basic Razorpay stub endpoint (replace keys and verify on production)
app.post('/api/pay', (req, res) => {
  // In a real app generate an order via Razorpay SDK here.
  // Return an order object for client-side checkout.
  res.json({ orderId: 'rzp_test_placeholder', amount: 10000 });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
