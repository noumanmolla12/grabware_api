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

// ✅ CREATE: Add header with images
router.post('/add', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'text_logo_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { language, company_name, phone, facebook, instagram, twitter, youtube } = req.body;

    if (!language || !company_name || !phone) {
      return res.status(400).json({ error: 'language, company_name and phone are required.' });
    }

    const newHeader = new Header({
      language,
      company_name,
      phone,
      facebook,
      instagram,
      twitter,
      youtube,
      logo: req.files.logo?.[0]?.filename || '',
      text_logo_image: req.files.text_logo_image?.[0]?.filename || ''
    });

    const savedHeader = await newHeader.save();
    res.status(201).json(savedHeader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ: All headers
router.get('/all', async (req, res) => {
  try {
    const headers = await Header.find();
    res.json(headers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ: Header by language (e.g., ?lang=hi)
router.get('/', async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const header = await Header.findOne({ language: lang });

    if (!header) {
      return res.status(404).json({ error: 'Header not found for this language' });
    }

    res.json(header);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ: Single header by ID
router.get('/single/:id', async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ error: 'Header not found' });
    res.json(header);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE: Header with optional image replacement
router.put('/edit/:id', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'text_logo_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ error: 'Header not found' });

    if (req.files.logo && header.logo) {
      fs.unlinkSync(`uploads/${header.logo}`);
    }
    if (req.files.text_logo_image && header.text_logo_image) {
      fs.unlinkSync(`uploads/${header.text_logo_image}`);
    }

    const updatedData = {
      ...req.body,
      logo: req.files.logo?.[0]?.filename || header.logo,
      text_logo_image: req.files.text_logo_image?.[0]?.filename || header.text_logo_image,
      language: req.body.language || header.language
    };

    const updatedHeader = await Header.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedHeader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE: Header and its images
router.delete('/delete/:id', async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ error: 'Header not found' });

    if (header.logo) {
      fs.unlinkSync(`uploads/${header.logo}`);
    }
    if (header.text_logo_image) {
      fs.unlinkSync(`uploads/${header.text_logo_image}`);
    }

    await Header.findByIdAndDelete(req.params.id);
    res.json({ message: 'Header deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;











// const express = require('express');
// const router = express.Router();
// const Header = require('../models/Header');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// // CREATE: Add header with images
// router.post('/add', upload.fields([
//   { name: 'logo', maxCount: 1 },
//   { name: 'text_logo_image', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const { company_name, phone, facebook, instagram, twitter, youtube } = req.body;

//     // Server-side validation for required fields
//     if (!company_name || !phone) {
//       return res.status(400).json({ error: 'company_name and phone are required.' });
//     }

//     const newHeader = new Header({
//       company_name,
//       phone,
//       facebook,
//       instagram,
//       twitter,
//       youtube,
//       logo: req.files.logo?.[0]?.filename || '',
//       text_logo_image: req.files.text_logo_image?.[0]?.filename || ''
//     });

//     const savedHeader = await newHeader.save();
//     res.status(201).json(savedHeader);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // READ: All headers
// router.get('/all', async (req, res) => {
//   try {
//     const headers = await Header.find();
//     res.json(headers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // READ: Single header
// router.get('/single/:id', async (req, res) => {
//   try {
//     const header = await Header.findById(req.params.id);
//     if (!header) return res.status(404).json({ error: 'Header not found' });
//     res.json(header);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE: Header with optional image replacement
// router.put('/edit/:id', upload.fields([
//   { name: 'logo', maxCount: 1 },
//   { name: 'text_logo_image', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const header = await Header.findById(req.params.id);
//     if (!header) return res.status(404).json({ error: 'Header not found' });

//     // Delete old images if new ones are uploaded
//     if (req.files.logo && header.logo) {
//       fs.unlinkSync(`uploads/${header.logo}`);
//     }
//     if (req.files.text_logo_image && header.text_logo_image) {
//       fs.unlinkSync(`uploads/${header.text_logo_image}`);
//     }

//     const updatedData = {
//       ...req.body,
//       logo: req.files.logo?.[0]?.filename || header.logo,
//       text_logo_image: req.files.text_logo_image?.[0]?.filename || header.text_logo_image
//     };

//     const updatedHeader = await Header.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//     res.json(updatedHeader);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // DELETE: Header and its images
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const header = await Header.findById(req.params.id);
//     if (!header) return res.status(404).json({ error: 'Header not found' });

//     // Delete associated images
//     if (header.logo) {
//       fs.unlinkSync(`uploads/${header.logo}`);
//     }
//     if (header.text_logo_image) {
//       fs.unlinkSync(`uploads/${header.text_logo_image}`);
//     }

//     await Header.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Header deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;











