const { verifyToken } = require('../utils/auth');
const { findUserById } = require('../utils/dataStore');

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

// Requires a valid login. Attaches req.user = { id, name, email, role, campusId }
const authenticate = async (req, res, next) => {
  try {
    const payload = verifyToken(extractToken(req));
    if (!payload) {
      return res.status(401).json({ success: false, message: 'Please log in to continue' });
    }
    // Re-check the account on every request so deactivated users lose access immediately
    const user = await findUserById(payload.sub);
    if (!user || user.isActive === false) {
      return res.status(401).json({ success: false, message: 'Account not found or deactivated' });
    }
    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      campusId: user.campusId
    };
    next();
  } catch (err) {
    next(err);
  }
};

// Use after authenticate. Example: requireRole('admin')
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Please log in to continue' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have permission to do that' });
  }
  next();
};

// Tiny in-memory rate limiter for login/signup (per IP + route)
const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 20 } = {}) => {
  const hits = new Map();
  return (req, res, next) => {
    const ip = (req.socket && req.socket.remoteAddress) || req.ip || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Please try again later.' });
    }
    next();
  };
};

module.exports = { authenticate, requireRole, rateLimit };
