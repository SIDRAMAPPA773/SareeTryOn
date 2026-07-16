const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const errorHandler = require('./middleware/errorHandler');

// Route files
const sareeRoutes = require('./routes/sareeRoutes');
const tryOnRoutes = require('./routes/tryOnRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const jewelryRoutes = require('./routes/jewelryRoutes');
const jewelryAdminRoutes = require('./routes/jewelryAdminRoutes');
const embedRoutes = require('./routes/embedRoutes');

const app = express();

// Trust proxy required for Render and secure cookies
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow loading images cross-origin
}));

// Body parser, cookies & CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  credentials: true
}));
app.options('/*', cors());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme-super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saree-tryon',
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Serve static directories
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/sarees', sareeRoutes);
app.use('/api/tryon', tryOnRoutes);
app.use('/api/auth', adminAuthRoutes);
app.use('/api/superadmin', superAdminRoutes);
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
