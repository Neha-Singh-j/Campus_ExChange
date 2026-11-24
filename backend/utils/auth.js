// Password hashing and JWT helpers built on Node's built-in crypto module,
// so no extra npm packages (bcrypt, jsonwebtoken) are required.
const crypto = require('crypto');

const PLACEHOLDER_SECRETS = ['', 'change-me', 'changeme', 'your-secret-here', 'replace-with-a-long-random-string'];
const TOKEN_TTL_SECONDS = Number(process.env.JWT_EXPIRES_SECONDS) || 7 * 24 * 60 * 60;

let cachedSecret = null;

const getSecret = () => {
  if (cachedSecret) return cachedSecret;
  const fromEnv = (process.env.JWT_SECRET || '').trim();
  if (fromEnv && !PLACEHOLDER_SECRETS.includes(fromEnv) && fromEnv.length >= 16) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a long random string in production');
  }
  // Development fallback: random per-process secret (tokens stop working on restart)
  cachedSecret = crypto.randomBytes(48).toString('hex');
  console.warn('JWT_SECRET is not set (or is a placeholder). Using a temporary secret; logins reset on restart.');
  return cachedSecret;
};

const b64url = (input) => Buffer.from(input).toString('base64url');

// ---------- Passwords (scrypt) ----------
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
};

const verifyPassword = (password, stored) => {
  try {
    const [scheme, saltHex, hashHex] = String(stored || '').split('$');
    if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(String(password), Buffer.from(saltHex, 'hex'), expected.length);
    return crypto.timingSafeEqual(expected, actual);
  } catch (err) {
    return false;
  }
};

// ---------- JWT (HS256) ----------
const signToken = (payload, ttlSeconds = TOKEN_TTL_SECONDS) => {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds }));
  const sig = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
};

const verifyToken = (token) => {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  try {
    const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
    if (parsedHeader.alg !== 'HS256') return null;
    const expected = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest();
    const actual = Buffer.from(sig, 'base64url');
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (err) {
    return null;
  }
};

const resetSecretCache = () => {
  cachedSecret = null;
};

module.exports = { hashPassword, verifyPassword, signToken, verifyToken, resetSecretCache, PLACEHOLDER_SECRETS };
