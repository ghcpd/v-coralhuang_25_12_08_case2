const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const contact = new Contact({ name, email, message });
    await contact.save();
    
    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `New Contact Message from ${name}`,
        html: `<h2>New Contact Message</h2>
               <p><strong>From:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }
    
    res.status(201).json({ message: 'Thank you for contacting us. We will respond soon.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
