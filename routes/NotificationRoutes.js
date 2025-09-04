const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const multer = require("multer");
const path = require("path");

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/notifications/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// ADD notification
router.post("/add", upload.fields([{ name: "pdf" }, { name: "photo" }]), async (req, res) => {
  try {
    const { category, title, details, validUpto, status } = req.body;
    const pdf = req.files.pdf ? req.files.pdf[0].filename : null;
    const photo = req.files.photo ? req.files.photo[0].filename : null;

    const newNotification = new Notification({ category, title, details, pdf, photo, validUpto, status });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VIEW all notifications
router.get("/view", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// EDIT notification
router.put("/edit/:id", upload.fields([{ name: "pdf" }, { name: "photo" }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, details, validUpto, status } = req.body;
    const pdf = req.files.pdf ? req.files.pdf[0].filename : undefined;
    const photo = req.files.photo ? req.files.photo[0].filename : undefined;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { category, title, details, validUpto, status, ...(pdf && { pdf }), ...(photo && { photo }) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE notification
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;













