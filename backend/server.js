const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxies (Render, Railway, Vercel, Cloudflare, etc.)
app.set('trust proxy', 1);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configured CORS with support for FRONTEND_URL, Vercel domains, and localhost
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://student-details-portal.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., Postman, curl, internal health checks)
      if (!origin) return callback(null, true);

      // Check configured frontend origin or any Vercel preview domain
      if (
        process.env.FRONTEND_URL === '*' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      // Permissive fallback so client apps are not blocked
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Student Records Portal API',
    endpoints: {
      health: '/api/health',
      students: '/api/students',
    },
    environment: process.env.NODE_ENV || 'production',
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Student Records Portal API',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
});

// Start server after DB initialization
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Student Portal API Server running on port ${PORT}`);
      console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👉 Students API: http://localhost:${PORT}/api/students`);
    });
  } catch (error) {
    console.error('❌ Failed to start server due to database error:', error);
    process.exit(1);
  }
}

startServer();
