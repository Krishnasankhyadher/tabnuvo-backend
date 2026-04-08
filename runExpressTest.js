import express from 'express';
import workRoutes from './routes/workRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', workRoutes);

app.use((err, req, res, next) => {
  console.error('EXPRESS ERROR:', err.message);
  res.status(500).json({ msg: err.message });
});

async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(9999, () => {
    console.log('Test server up on 9999');
  });
}
run();
