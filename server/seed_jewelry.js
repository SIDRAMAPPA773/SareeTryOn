require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Plan = require('./models/Plan');
const SystemSetting = require('./models/SystemSetting');
const AdminUser = require('./models/AdminUser');
const connectDB = require('./config/db');

const seedJewelry = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing jewelry plans, settings, and admin users...');
    await Plan.deleteMany({});
    await SystemSetting.deleteMany({});
    
    // Only delete default admin if we want a clean slate
    await AdminUser.deleteMany({ username: 'admin' });

    // 1. Seed Plans
    const defaultPlans = [
      {
        id: 'free',
        name: 'Free',
        description: 'Get started with Pixrity',
        price_inr: 0,
        credits: 3,
        features: [
          '3 generations/month',
          '360° interactive viewer',
          'PIX embed code',
          'No credit card required'
        ],
        download_glb: false,
        is_active: true,
        sort_order: 0
      },
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for jewelry designers',
        price_inr: 49900, // in paise = ₹499
        credits: 10,
        features: [
          '10 generations/month',
          '360° interactive viewer',
          'PIX embed code',
          'Download GLB files',
          'Priority support'
        ],
        download_glb: true,
        is_active: true,
        sort_order: 1
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For professional studios & retailers',
        price_inr: 149900, // in paise = ₹1499
        credits: 999, // 999 is checked as unlimited in frontend
        features: [
          'Unlimited generations',
          '360° interactive viewer',
          'PIX embed code',
          'Download GLB files',
          'Priority support',
          'Dedicated account manager'
        ],
        download_glb: true,
        is_active: true,
        sort_order: 2
      }
    ];

    await Plan.insertMany(defaultPlans);
    console.log('✅ Seeded default plans successfully');

    // 2. Seed System Settings
    const defaultSettings = [
      {
        key: 'credits_per_generation',
        value: '30',
        updated_by: 'system'
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        updated_by: 'system'
      }
    ];

    await SystemSetting.insertMany(defaultSettings);
    console.log('✅ Seeded default system settings successfully');

    // 3. Seed Default Super Admin
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('adminpassword', salt);

    await AdminUser.create({
      username: 'admin',
      password_hash,
      role: 'SUPER_ADMIN'
    });
    console.log('✅ Seeded default Super Admin successfully');
    console.log('   Username: admin');
    console.log('   Password: adminpassword');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedJewelry();
