const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    campusId: { type: String, default: 'berkeley' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    // Students only. Admins are not students, so they never get a profile.
    studentProfile: {
      universityName: String,
      rollNo: String,
      universityEmail: String,
      personalEmail: String,
      department: String,
      phone: String,
      yearOfStudy: String,
      idProofName: String,
      verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' }
    },
    // The ID card photo (data URL). Hidden from normal queries; only fetched on request.
    idProofImage: { type: String, select: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
