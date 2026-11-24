const { hashPassword, PLACEHOLDER_SECRETS } = require('./auth');
const { findUserByEmail, createUser } = require('./dataStore');

const BAD_PASSWORDS = [...PLACEHOLDER_SECRETS, 'admin', 'admin123', 'password', 'password123', 'ChangeMe123!'];

// Creates the single admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
// The password is never stored in code; only its hash is saved.
const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!email || !password) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set: no admin account created.');
    return;
  }
  if (password.length < 10 || BAD_PASSWORDS.includes(password)) {
    console.warn('ADMIN_PASSWORD is too weak or a placeholder (need 10+ characters): admin account NOT created.');
    return;
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      if (existing.role !== 'admin') {
        console.warn(`${email} already exists as a student account; not promoting it automatically.`);
      }
      return;
    }
    await createUser({ name: 'Administrator', email, passwordHash: hashPassword(password), role: 'admin' });
    console.log(`Admin account created for ${email}`);
  } catch (err) {
    console.error('Could not create admin account:', err.message);
  }
};

module.exports = seedAdmin;
