import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import analyzeRoutes from './routes/analyze.js';
import zenserpRoutes from './routes/products-zenserp.js';
import userProfileRoutes from './routes/userProfile.js';
import assistantRoutes from './routes/assistant.js'; // ✅ Bunu əlavə et

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/analyze', analyzeRoutes);
app.use('/api/products', zenserpRoutes);
app.use('/api/user', userProfileRoutes);
app.use('/api/assistant', assistantRoutes); // ✅ Bunu əlavə et

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
