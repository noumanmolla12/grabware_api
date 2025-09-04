// routes/orderCircularRoutes.js
const express = require("express");
const router = express.Router();
const OrderCircular = require("../models/OrderCircular");

// CREATE
router.post("/add", async (req, res) => {
  try {
    const { department, noticeNumber, noticeDate, noticeSubject } = req.body;

    const newCircular = new OrderCircular({
      department,
      noticeNumber,
      noticeDate,
      noticeSubject,
    });

    await newCircular.save();
    res.status(201).json(newCircular);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all
router.get("/all", async (req, res) => {
  try {
    const circulars = await OrderCircular.find().sort({ createdAt: -1 });
    res.json(circulars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ one
router.get("/single/:id", async (req, res) => {
  try {
    const circular = await OrderCircular.findById(req.params.id);
    if (!circular) return res.status(404).json({ error: "Not found" });
    res.json(circular);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/edit/:id", async (req, res) => {
  try {
    const updated = await OrderCircular.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await OrderCircular.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
