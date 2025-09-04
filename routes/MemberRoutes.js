// routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/members/"); // store images in uploads/ folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/**
 * CREATE: Add Member (with image)
 */
router.post("/add", upload.single("image"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required." });
    if (!req.file) return res.status(400).json({ error: "Image is required." });

    const newMember = new Member({
      name,
      image: req.file.filename,
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * READ: All Members
 */
router.get("/all", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * READ: Single Member
 */
router.get("/single/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE: Member (with optional image replacement)
 */
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    // Delete old image if new one uploaded
    if (req.file && member.image) {
      const oldPath = `uploads/members/${member.image}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const updatedData = {
      ...req.body,
      image: req.file?.filename || member.image,
    };

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE: Member (and remove image from uploads)
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    if (member.image) {
      const oldPath = `uploads/members/${member.image}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
