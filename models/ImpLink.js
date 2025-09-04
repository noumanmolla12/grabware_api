const mongoose = require('mongoose');

const importantLinkSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Store filename or URL
  link_name: { type: String, required: true }, // Display text
  link_url: { type: String, required: true } // Actual link destination
}, { timestamps: true });

module.exports = mongoose.model('ImportantLink', importantLinkSchema);
