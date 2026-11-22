const { hashPassword, verifyPassword, signToken } = require('../utils/auth');
const { findUserByEmail, createUser, touchLastLogin, publicUser, rollNoTaken } = require('../utils/dataStore');
const { parseStudentProfile } = require('../utils/studentProfile');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const issueSession = (user) => ({
  token: signToken({ sub: String(user._id), role: user.role }),
  user: publicUser(user)
});

// POST /api/auth/signup  (always creates a "student"; role cannot be chosen by the client)
// The login email is the student's university email. Roll number, college and an ID photo are required.
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, campusId } = req.body || {};

    if (!name || !String(name).trim() || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }
    if (process.env.REQUIRE_EDU_EMAIL === 'true' && !cleanEmail.endsWith('.edu')) {
      return res.status(400).json({ success: false, message: 'Signup requires a university .edu email address' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    if (await findUserByEmail(cleanEmail)) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    // Student details (the login email doubles as the university email)
    const parsed = parseStudentProfile({ ...req.body, universityEmail: cleanEmail }, { requireIdProof: true });
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error });
    }
    if (await rollNoTaken(parsed.profile.universityName, parsed.profile.rollNo)) {
      return res
        .status(409)
        .json({ success: false, message: 'That roll number is already registered at this university' });
    }

    const user = await createUser({
      name: String(name).trim().slice(0, 80),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      role: 'student',
      campusId: campusId || 'berkeley',
      studentProfile: parsed.profile,
      idProofImage: parsed.idProofImage
    });

    res.status(201).json({ success: true, message: 'Account created', data: issueSession(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login  (used by both students and the admin)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    // Same message for unknown email and wrong password, so accounts can't be probed
    if (!user || user.isActive === false || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await touchLastLogin(user._id);
    res.status(200).json({ success: true, message: 'Logged in', data: issueSession(user) });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
