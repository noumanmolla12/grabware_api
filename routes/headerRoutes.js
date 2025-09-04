const express = require('express');
const router = express.Router();
const Header = require('../models/Header');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// CREATE: Add header with logo image only
router.post('/add', upload.single('logo'), async (req, res) => {
  try {
    const { company_name, phone, facebook, instagram, twitter, youtube } = req.body;

    if (!company_name || !phone) {
      return res.status(400).json({ error: 'company_name and phone are required.' });
    }

    const newHeader = new Header({
      company_name,
      phone,
      facebook,
      instagram,
      twitter,
      youtube,
      logo: req.file?.filename || ''
    });

    const savedHeader = await newHeader.save();
    res.status(201).json(savedHeader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ: All headers
router.get('/all', async (req, res) => {
  try {
    const headers = await Header.find();
    res.json(headers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: Single header
router.get('/single/:id', async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ error: 'Header not found' });
    res.json(header);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Header with optional logo replacement
router.put('/edit/:id', upload.single('logo'), async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ error: 'Header not found' });

    // Delete old logo if new one uploaded
    if (req.file && header.logo) {
      fs.unlinkSync(`uploads/${header.logo}`);
    }

    const updatedData = {
      ...req.body,
      logo: req.file?.filename || header.logo
    };

    const updatedHeader = await Header.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedHeader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Header and its logo
router.delete('/delete/:id', async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ error: 'Header not found' });

    if (header.logo) {
      fs.unlinkSync(`uploads/${header.logo}`);
    }

    await Header.findByIdAndDelete(req.params.id);
    res.json({ message: 'Header deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

