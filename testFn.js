import { createWork } from './controllers/workController.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const req = {
  body: {
    title: 'Test Create 2',
    subtitle: 'sub',
    cards: '[{"title":"Zap","description":"desc"}]',
    techStack: 'React, Node'
  },
  files: {}
};

const res = {
  status: function(code) { console.log('STATUS:', code); return this; },
  json: function(data) { console.log('JSON:', data); return this; }
};

async function test() {
  await mongoose.connect(process.env.MONGO_URL);
  await createWork(req, res);
  process.exit(0);
}

test();
