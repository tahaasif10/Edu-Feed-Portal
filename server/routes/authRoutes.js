const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// POST /auth/admin/login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(admin._id),
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
