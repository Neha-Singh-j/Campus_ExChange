const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');
const { normalizeEmail, isValidEmail, isCampusEmail, passwordProblem } = require('../utils/validators');

const BCRYPT_ROUNDS = 12;
// Compared against when the email is unknown so login takes the same time either way.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, config.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.expiresIn,
  });

const cleanText = (v, max) => String(v || '').trim().slice(0, max);

// POST /api/auth/register
exports.register = async (req, res) => {
  const name = cleanText(req.body.name, 80);
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (name.length < 2) throw new AppError(400, 'Please enter your full name.', 'VALIDATION');
  if (!isValidEmail(email)) throw new AppError(400, 'Please enter a valid email address.', 'VALIDATION');
  if (!isCampusEmail(email)) {
    throw new AppError(
      400,
      `Please use your campus email (${config.allowedEmailDomains.map((d) => `@${d}`).join(' or ')}).`,
      'EMAIL_DOMAIN'
    );
  }
  const pwProblem = passwordProblem(password);
  if (pwProblem) throw new AppError(400, pwProblem, 'WEAK_PASSWORD');

  if (await User.exists({ email })) {
    throw new AppError(409, 'An account with this email already exists. Please log in.', 'EMAIL_EXISTS');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    department: cleanText(req.body.department, 80),
    year: cleanText(req.body.year, 40),
    campusId: config.campusId,
    isVerified: true,
    verifiedAt: new Date(),
    lastLoginAt: new Date(),
  });

  res.status(201).json({ success: true, token: signToken(user), user: user.toPrivate() });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  const user = await User.findOne({ email }).select('+passwordHash');
  const passwordOk = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !passwordOk) {
    throw new AppError(401, 'Incorrect email or password.', 'BAD_CREDENTIALS');
  }

  // Accounts left over from the old email-code sign-up become normal accounts on first login.
  if (!user.isVerified) {
    user.isVerified = true;
    user.verifiedAt = new Date();
  }

  user.lastLoginAt = new Date();
  await user.save();
  res.json({ success: true, token: signToken(user), user: user.toPrivate() });
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({ success: true, user: req.user.toPrivate() });
};

// PATCH /api/auth/me
exports.updateMe = async (req, res) => {
  const { name, department, year } = req.body;
  if (name !== undefined) {
    const n = cleanText(name, 80);
    if (n.length < 2) throw new AppError(400, 'Please enter your full name.', 'VALIDATION');
    req.user.name = n;
  }
  if (department !== undefined) req.user.department = cleanText(department, 80);
  if (year !== undefined) req.user.year = cleanText(year, 40);
  await req.user.save();
  res.json({ success: true, user: req.user.toPrivate() });
};
