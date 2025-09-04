const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, required: true },
  event_name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
