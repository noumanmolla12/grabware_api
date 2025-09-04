const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImportantLink = require('../models/ImpLink');

// Ensure the directory exists
const uploadDir = path.join(__dirname, '../uploads/implinks');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config inline
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // uploads/implinks
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// @route   POST /api/important-links/add
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { link_name, link_url } = req.body;
    const image = req.file.filename;

    const newLink = await ImportantLink.create({ link_name, link_url, image });
    res.status(201).json(newLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating link' });
  }
});

// @route   GET /api/important-links
router.get('/all/', async (req, res) => {
  try {
    const links = await ImportantLink.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching links' });
  }
});

// @route   GET /api/important-links/:id
router.get('/single/:id', async (req, res) => {
  try {
    const link = await ImportantLink.findById(req.params.id);
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching link' });
  }
});

// @route   PUT /api/important-links/:id
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { link_name, link_url } = req.body;
    const updateFields = { link_name, link_url };

    if (req.file) {
      updateFields.image = req.file.filename;
    }

    const updatedLink = await ImportantLink.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updatedLink);
  } catch (err) {
    res.status(500).json({ message: 'Error updating link' });
  }
});

// @route   DELETE /api/important-links/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    await ImportantLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting link' });
  }
});

module.exports = router;
