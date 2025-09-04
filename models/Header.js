const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  // text_logo_image: { type: String },  // Optional
  company_name: { type: String, required: true },
  phone: { type: String, required: true },
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  youtube: { type: String },
  logo: { type: String }             // Filename of uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Header', headerSchema);





