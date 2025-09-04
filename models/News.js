const mongoose = require('mongoose');

const eventImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true, // store image URL or file path
  },
  caption: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('EventImage', eventImageSchema);
