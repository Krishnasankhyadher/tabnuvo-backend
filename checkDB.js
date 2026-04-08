import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Work from './models/workModel.js';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    const work = await Work.create({ title: 'Test Build', slug: 'test-build', category: 'Testing', cards: [{ title: 'test', description: 'test' }] });
    console.log('SUCCESS:', work._id);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  process.exit(0);
}
check();
