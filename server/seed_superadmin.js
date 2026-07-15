require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminUser = require('./models/AdminUser');
const connectDB = require('./config/db');

const seedSuperAdmin = async () => {
  try {
    await connectDB();
    
    const adminCount = await AdminUser.countDocuments({ role: 'SUPERADMIN' });
    if (adminCount > 0) {
      console.log('Superadmin already exists. Skipping seed.');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('superadmin123', salt);
    
    await AdminUser.create({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password_hash,
      role: 'SUPERADMIN',
      isActive: true
    });
    
    console.log('Superadmin created successfully. (username: superadmin, password: superadmin123)');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding superadmin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
