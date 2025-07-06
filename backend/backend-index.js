import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import analyzeRoutes from './routes/analyze.js';
import zenserpRoutes from './routes/products-zenserp.js';
import userProfileRoutes from './routes/userProfile.js';
import assistantRoutes from './routes/assistant.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://croplynx.vercel.app',
  'https://croplynx-nahid-droids-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy blocked this origin: ' + origin));
    }
  }
}));

app.use(express.json());

app.use('/analyze', analyzeRoutes);
app.use('/api/products', zenserpRoutes);
app.use('/api/user', userProfileRoutes);
app.use('/api/assistant', assistantRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});


