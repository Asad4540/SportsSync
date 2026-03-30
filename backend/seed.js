require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/react_crud_app';

const seedUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database');

    // Create a mock user if it doesn't exist
    const userExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);

      const newAdmin = new User({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword  
      });
      await newAdmin.save();
      console.log('Test user created successfully!');
      console.log('Email: admin@gmail.com');
      console.log('Password: Admin@123');
    } else {
      console.log('Test user already exists.');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding user: ', error);
    process.exit(1);
  }
};

seedUser();
