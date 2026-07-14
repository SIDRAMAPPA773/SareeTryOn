const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route files
const sareeRoutes = require('./routes/sareeRoutes');
const tryOnRoutes = require('./routes/tryOnRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const jewelryRoutes = require('./routes/jewelryRoutes');
const jewelryAdminRoutes = require('./routes/jewelryAdminRoutes');
const embedRoutes = require('./routes/embedRoutes');

const app = express();

// Body parser, cookies & CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.PIXRITY_FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));

// Serve static directories
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/sarees', sareeRoutes);
app.use('/api/tryon', tryOnRoutes);
app.use('/admin/auth', adminAuthRoutes);
app.use('/api/jewelry', jewelryRoutes);
app.use('/api/admin/jewelry', jewelryAdminRoutes);
app.use('/', embedRoutes); // Mount at root for /embed.js and /embed/:code/...

// Catch-all route for undefined endpoints
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
