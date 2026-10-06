const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const adminName = process.env.ADMIN_NAME || 'Super Admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tpcollege.ac.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() });

    if (existingAdmin) {
      console.log(`ℹ️ Admin with email '${adminEmail}' already exists (Role: ${existingAdmin.role}).`);
      console.log('Skipping creation. No duplicate created.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create superadmin
    const newAdmin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin',
      isActive: true,
    });

    console.log('🎉 Superadmin created successfully:');
    console.log(`   ID:    ${newAdmin._id}`);
    console.log(`   Name:  ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role:  ${newAdmin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
