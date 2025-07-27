const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = new Admin({
      email: 'admin@s.com',
      password: 'admin', // this will be hashed
    });
    await admin.save();
    console.log('✅ Admin created');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
