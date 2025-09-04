const mongoose = require("mongoose");

const navbarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    visible: { type: Boolean, default: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Navbar", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Navbar", navbarSchema);
