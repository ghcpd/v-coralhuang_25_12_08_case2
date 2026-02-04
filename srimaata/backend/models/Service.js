const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['before-conception', 'pregnancy', 'postnatal'],
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 60,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
