const crypto = require('crypto');
const Otp = require('../models/Otp');
const config = require('../config');
const AppError = require('./AppError');

const hash = (email, code) =>
  crypto.createHmac('sha256', config.jwt.secret).update(`${email}:${code}`).digest('hex');

/** Creates (or replaces) a 6-digit code for the email and returns it. */
const issueOtp = async (email) => {
  const existing = await Otp.findOne({ email, purpose: 'verify' });
  if (existing) {
    const waitMs = existing.lastSentAt.getTime() + config.otp.resendCooldownSeconds * 1000 - Date.now();
    if (waitMs > 0) {
      throw new AppError(
        429,
        `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another code.`,
        'OTP_COOLDOWN'
      );
    }
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  await Otp.findOneAndUpdate(
    { email, purpose: 'verify' },
    {
      codeHash: hash(email, code),
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + config.otp.ttlMinutes * 60 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return code;
};

/** Throws unless `code` is the live code for `email`. A correct code is single-use. */
const checkOtp = async (email, code) => {
  const record = await Otp.findOne({ email, purpose: 'verify' });
  if (!record || record.expiresAt.getTime() < Date.now()) {
    throw new AppError(400, 'This code has expired. Please request a new one.', 'OTP_EXPIRED');
  }
  if (record.attempts >= config.otp.maxAttempts) {
    await record.deleteOne();
    throw new AppError(429, 'Too many incorrect attempts. Please request a new code.', 'OTP_LOCKED');
  }

  const expected = Buffer.from(record.codeHash);
  const actual = Buffer.from(hash(email, code));
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    record.attempts += 1;
    await record.save();
    throw new AppError(400, 'Incorrect code. Please check and try again.', 'OTP_INVALID');
  }
  await record.deleteOne();
};

module.exports = { issueOtp, checkOtp };
