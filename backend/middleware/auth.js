const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');

const readToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
};

const userFromToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
    return await User.findById(payload.sub);
  } catch {
    return null;
  }
};

/** Requires a valid token; sets req.user. */
const protect = async (req, res, next) => {
  const token = readToken(req);
  if (!token) throw new AppError(401, 'Please log in to continue.', 'AUTH_REQUIRED');
  const user = await userFromToken(token);
  if (!user) throw new AppError(401, 'Your session has expired. Please log in again.', 'AUTH_INVALID');
  req.user = user;
  next();
};

/** Sets req.user when a valid token is present, otherwise continues anonymously. */
const optionalAuth = async (req, res, next) => {
  const token = readToken(req);
  if (token) req.user = (await userFromToken(token)) || undefined;
  next();
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    throw new AppError(403, 'Please verify your campus email first.', 'EMAIL_NOT_VERIFIED');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') throw new AppError(403, 'Admin access required.', 'FORBIDDEN');
  next();
};

module.exports = { protect, optionalAuth, requireVerified, requireAdmin };
