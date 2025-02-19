import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

import { connectToDB } from './config/db.js';
import myUserRoute from './routes/my-user-route.js';
import bookRoute from './routes/book-route.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const PORT = process.env.PORT || 7000;

const __dirname = path.resolve();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use('/api/my/user', myUserRoute);
app.use('/api/book', bookRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server started at PORT: ${PORT}`);
});
