require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleetmanagement');
    console.log('MongoDB Connected for Seeding');

    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const driverPassword = await bcrypt.hash('driver123', salt);

    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@fleet.com',
      password: adminPassword,
      role: 'admin',
      phone: '1234567890'
    });

    const driverUser = await User.create({
      fullName: 'John Driver',
      email: 'john@fleet.com',
      password: driverPassword,
      role: 'driver',
      phone: '0987654321'
    });

    const vehicle = await Vehicle.create({
      registrationNumber: 'AB-12-CD-3456',
      make: 'Volvo',
      model: 'FH16',
      year: 2023,
      type: 'truck',
      fuelType: 'diesel',
      tankCapacity: 500,
      assignedDriverId: driverUser._id
    });

    await Driver.create({
      userId: driverUser._id,
      licenseNumber: 'DL-12345678',
      licenseExpiry: new Date('2030-01-01'),
      licenseType: 'Heavy',
      experience: 5,
      currentVehicleId: vehicle._id
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
