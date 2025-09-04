const express = require("express");
const router = express.Router();
const {
  addNavbar,
  getNavbars,
  updateNavbar,
  deleteNavbar,
} = require("../controllers/navbarController");

router.post("/add/", addNavbar);
router.get("/all/", getNavbars);
router.put("/edit/:id", updateNavbar);
router.delete("/delete/:id", deleteNavbar);

module.exports = router;
