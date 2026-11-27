const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    campusId: { type: String, required: true, index: true },
    department: { type: String, trim: true, maxlength: 80, default: '' },
    year: { type: String, trim: true, maxlength: 40, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

/** Safe to show to other students (no email). */
userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    department: this.department,
    year: this.year,
    avatar: this.avatar,
    verified: this.isVerified,
  };
};

/** The signed-in user's own profile. */
userSchema.methods.toPrivate = function toPrivate() {
  return {
    ...this.toPublic(),
    email: this.email,
    campusId: this.campusId,
    role: this.role,
    verifiedAt: this.verifiedAt,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
