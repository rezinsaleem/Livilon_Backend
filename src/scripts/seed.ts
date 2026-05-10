import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { hashPassword } from '../utils/password.util';
import { env } from '../config/env';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const hashedPwd = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin@123');

    await User.create({
      userId: process.env.ADMIN_USER_ID || 'ADMIN001',
      email: process.env.ADMIN_EMAIL || 'binthassan356@gmail.com',
      mobile: process.env.ADMIN_MOBILE || '9999999999',
      password: hashedPwd,
    });

    console.log('✅ Admin user seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
