const config = require('../config');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const isValidEmail = (email) => email.length <= 254 && EMAIL_RE.test(email);

/** True when the email's domain is an allowed campus domain or a subdomain of one. */
const isCampusEmail = (email) => {
  const domain = email.slice(email.lastIndexOf('@') + 1);
  return config.allowedEmailDomains.some((d) => domain === d || domain.endsWith(`.${d}`));
};

/** Returns an error message, or null when the password is acceptable. */
const passwordProblem = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (password.length > 72) return 'Password must be at most 72 characters long.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
};

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { normalizeEmail, isValidEmail, isCampusEmail, passwordProblem, escapeRegex };
