import app from './app.js';
import connectDB from './config/db.js';
import { PORT } from './config/env.js';

const start = async () => {
  await connectDB();
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
};

start();
