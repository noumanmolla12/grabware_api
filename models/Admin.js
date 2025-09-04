const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
