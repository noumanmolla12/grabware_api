const EventLink = require('../models/EventLink');
const fs = require('fs');
const path = require('path');

// CREATE
exports.addEventLink = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    const newEventLink = new EventLink({
      name,
      image: req.file.filename
    });

    const saved = await newEventLink.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ
exports.getAllEventLinks = async (req, res) => {
  try {
    const links = await EventLink.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.editEventLink = async (req, res) => {
  try {
    const existing = await EventLink.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'EventLink not found' });

    if (req.file && existing.image) {
      const oldImagePath = path.join('uploads', existing.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updated = await EventLink.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || existing.name,
        image: req.file?.filename || existing.image
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteEventLink = async (req, res) => {
  try {
    const eventLink = await EventLink.findById(req.params.id);
    if (!eventLink) return res.status(404).json({ error: 'EventLink not found' });

    const imagePath = path.join('uploads', eventLink.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await EventLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'EventLink deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
