const crypto = require('crypto');

const list = (value, fallback = []) =>
  value ? value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : fallback;

const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 5000;

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (isProd) {
    throw new Error('JWT_SECRET must be set in production.');
  }
  // Development only: a random per-process secret (all login tokens reset on restart).
  jwtSecret = crypto.randomBytes(48).toString('hex');
  console.warn('[config] JWT_SECRET is not set - using a temporary random secret (dev only).');
}

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

module.exports = {
  isProd,
  port,
  publicUrl: (process.env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, ''),
  campusId: process.env.CAMPUS_ID || 'gla',
  allowedEmailDomains: list(process.env.ALLOWED_EMAIL_DOMAINS, ['gla.ac.in']),
  jwt: { secret: jwtSecret, expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'Campus Exchange <no-reply@campus-exchange.local>',
  },
  smtpConfigured: Boolean(process.env.SMTP_HOST),
  // Brevo (free HTTP email API) - used instead of SMTP when BREVO_API_KEY is set.
  brevo: {
    apiKey: process.env.BREVO_API_KEY,
    senderEmail: process.env.BREVO_SENDER_EMAIL,
    senderName: process.env.BREVO_SENDER_NAME || 'Campus Exchange',
  },
  brevoConfigured: Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL),
  emailConfigured: Boolean((process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL) || process.env.SMTP_HOST),
  cloudinaryConfigured,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  limits: { maxImages: 5, maxImageBytes: 5 * 1024 * 1024, maxOfferRounds: 8 },
};
