const express = require('express');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { UPLOAD_DIR } = require('./utils/imageStore');

const app = express();
app.disable('x-powered-by');
// Set TRUST_PROXY=1 when deployed behind a proxy (Render, Nginx...) so rate limiting sees real client IPs.
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = curl / Postman / same-origin requests.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

app.use(express.json({ limit: '100kb' }));

// Locally stored listing photos (used when Cloudinary is not configured).
app.use(
  '/uploads',
  (req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(UPLOAD_DIR, { index: false, dotfiles: 'ignore', maxAge: '7d' })
);

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
