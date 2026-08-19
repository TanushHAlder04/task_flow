import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import listRoutes from './routes/lists.js';

dotenv.config();

// Create __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/lists', listRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow Express Server Running' });
});

// Serve Static Frontend Files in Production
if (process.env.NODE_ENV === 'production') {
  const distFolder = path.join(__dirname, '../dist');
  
  // Serve built static React assets
  app.use(express.static(distFolder));

  // Catch-all route to serve React's index.html for SPA client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distFolder, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Backend Server running on http://localhost:${PORT}`);
});