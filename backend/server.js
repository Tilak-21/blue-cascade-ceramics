// Modern Express Server for Blue Cascade Ceramics
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import tileRoutes from './routes/tiles.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Blue Cascade Ceramics API',
    version: '1.0.0',
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'Blue Cascade Ceramics API',
    version: '1.0.0',
    endpoints: {
      public: {
        'GET /api/tiles': 'Get all tiles (with pagination and filters)',
        'GET /api/tiles/:id': 'Get single tile by ID',
      },
      auth: {
        'POST /api/auth/login': 'Admin login (username, password)',
      },
      admin: {
        'GET /api/admin/dashboard': 'Dashboard statistics (requires auth)',
        'POST /api/tiles': 'Create new tile (requires auth)',
        'PUT /api/tiles/:id': 'Update tile (requires auth)',
        'DELETE /api/tiles/:id': 'Delete tile (requires auth)',
      },
    },
    credentials: {
      username: 'admin',
      password: 'CascadeTiles2024!'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tiles', tileRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Blue Cascade Ceramics API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;