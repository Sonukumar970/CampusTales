require('dotenv').config();
const { connectDB } = require('../config/db');
const seedStoriesData = require('./seedStories');

const run = async () => {
  try {
    await connectDB();
    await seedStoriesData();
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding run error:', err);
    process.exit(1);
  }
};

run();
