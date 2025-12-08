const express = require('express');
const Razorpay = require('razorpay');
const Appointment = require('../models/Appointment');
const { verifyToken } = require('./auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId,
      },
    };
    
    const order = await razorpay.orders.create(options);
    
    // Update appointment with order ID
    await Appointment.findByIdAndUpdate(appointmentId, {
      razorpayOrderId: order.id,
    });
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;
    
    const crypto = require('crypto');
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    
    if (digest !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }
    
    // Update appointment with payment details
    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      status: 'confirmed',
    });
    
    res.json({ message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
