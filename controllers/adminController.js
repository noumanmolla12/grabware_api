const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


// Register Admin



exports.registerAdmin = async (req, res) => {
  console.log('Received Body:', req.body); 
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    console.log('Admin saved');

    res.status(201).json({ message: 'Admin registered successfully' });

  } catch (error) {
    console.error(' Register Admin Error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};




exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get Single Admin
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



exports.updateAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json({ message: 'Admin updated successfully.', admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};




// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    res.status(200).json({ msg: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};




exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log('🟡 LOGIN REQUEST:', { username, password });

  try {
    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      console.log('❌ Admin not found');
      return res.status(404).json({ msg: 'Admin not found' });
    }

    console.log('🔐 Stored hashed password:', admin.password);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('🔁 Password match result:', isMatch);

    if (!isMatch) {
      console.log('❌ Invalid credentials');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const { password: _, ...adminData } = admin.toObject();
    console.log('✅ Login successful:', adminData);

    res.status(200).json({ msg: 'Login successful', admin: adminData });
  } catch (err) {
    console.error('❌ Server error during login:', err.message);
    res.status(500).json({ msg: err.message });
  }
};



exports.changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  console.log('🟡 CHANGE PASSWORD REQUEST');
  console.log('username:', username);
  console.log('oldPassword:', oldPassword);
  console.log('newPassword:', newPassword);

  try {
    // SELECT password explicitly if it's excluded in the schema
    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      console.log('❌ Admin not found');
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    console.log('isMatch:', isMatch);

    if (!isMatch) {
      console.log('❌ Old password is incorrect');
      return res.status(400).json({ msg: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;

    await admin.save();

    console.log('✅ Password changed successfully');
    res.status(200).json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error('🔴 Server error:', err.message);
    res.status(500).json({ msg: err.message });
  }
};
