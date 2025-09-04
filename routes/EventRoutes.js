const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/events');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // e.g., 1692978123123.jpg
  }
});

const upload = multer({ storage });

// CREATE Event (POST /api/events)
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { caption, event_name } = req.body;
    const image = req.file?.filename;

    if (!caption || !event_name || !image) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newEvent = new Event({ caption, event_name, image });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET All Events (GET /api/events)
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET Single Event by ID (GET /api/events/:id)
router.get('/edit/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE Event by ID (PUT /api/events/:id)
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { caption, event_name } = req.body;
    const image = req.file?.filename;

    const updatedData = { caption, event_name };
    if (image) updatedData.image = image;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE Event by ID (DELETE /api/events/:id)
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
