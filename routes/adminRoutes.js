const express = require('express');
const { body } = require('express-validator');
const {
  registerAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  changePassword
} = require('../controllers/adminController');

const router = express.Router();

router.post(
  '/add/',
  [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters')
  ],
  registerAdmin
);

router.get('/all/', getAdmins);
router.get('/single/:id', getAdmin);
router.put('/edit/:id', updateAdmin);
router.delete('/delete/:id', deleteAdmin);

router.post('/login', loginAdmin);
router.put('/change-password', changePassword);


module.exports = router;
