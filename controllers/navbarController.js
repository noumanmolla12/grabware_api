const Navbar = require("../models/Navbar");



exports.addNavbar = async (req, res) => {
  try {
    if (req.body.parentId === "" || !req.body.parentId) {
      req.body.parentId = null;
    }

    const navbar = new Navbar(req.body);
    await navbar.save();
    res.json(navbar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getNavbars = async (req, res) => {
  try {
    const navbars = await Navbar.find();
    res.json(navbars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








exports.updateNavbar = async (req, res) => {
  try {
    if (req.body.parentId === "" || !req.body.parentId) {
      req.body.parentId = null;
    }

    const navbar = await Navbar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(navbar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteNavbar = async (req, res) => {
  try {
    await Navbar.findByIdAndDelete(req.params.id);
    res.json({ message: "Navbar deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
