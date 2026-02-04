const express = require('express');
const Appointment = require('../models/Appointment');
const { verifyToken } = require('./auth');
const router = express.Router();

// Create appointment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { serviceName, appointmentDate, appointmentTime, notes } = req.body;
    
    const appointment = new Appointment({
      userId: req.userId,
      serviceName,
      appointmentDate,
      appointmentTime,
      notes,
    });
    
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's appointments
router.get('/', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId }).sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get appointment by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel appointment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
