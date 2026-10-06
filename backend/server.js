const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

const app = express();

// ── Security Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cookieParser());

// CORS configuration
// Parses each env var supporting comma-separated URLs, e.g. CLIENT_URL=http://a.com,http://b.com
const parseOrigins = (envValue) =>
  (envValue || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.ADMIN_URL),
  // Always permit local dev origins in non-production
  ...(process.env.NODE_ENV !== 'production'
    ? [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ]
    : []),
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no Origin header) and whitelisted origins
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin '${origin}' is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Authorization header required for Bearer token auth
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize MongoDB query injection
app.use(mongoSanitize());

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'T.P. College BCA Backend API is running healthy.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Mount Routes ──────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const pyqRoutes = require('./routes/pyqRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const campusUpdateRoutes = require('./routes/campusUpdateRoutes');
const academicRoutes = require('./routes/academicRoutes');
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Apply login rate limiter specifically to /api/auth/login
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/pyqs', pyqRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/campus-updates', campusUpdateRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/coordinators', coordinatorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// ── Error Handling Middleware ──────────────────────────────────────────────────
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 T.P. College Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // In production, keep running or gracefully shutdown
});

module.exports = app;
