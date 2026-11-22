const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    campus: { type: String, default: 'UC Berkeley – Main Campus' },
    academicEmail: { type: String, required: true, trim: true, lowercase: true },
    studentType: {
      type: String,
      enum: ['Undergraduate', 'Graduate / Ph.D.', 'Faculty / Staff', 'Verified Alumni'],
      default: 'Undergraduate'
    },
    idScanFileName: { type: String, default: 'cal1_front_scan_2025.png' },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'VERIFIED'
    },
    studentName: { type: String, default: 'Alex Morgan' },
    studentId: { type: String, default: '3034928190' },
    department: { type: String, default: 'Haas School of Business' },
    expirationDate: { type: String, default: 'MAY 2026' },
    matriculated: { type: Boolean, default: true },
    trustScore: { type: Number, default: 99.4 },
    safeExchanges: { type: Number, default: 42 },
    disputes: { type: Number, default: 0 },
    positiveReviews: { type: Number, default: 38 },
    consent: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Verification', verificationSchema);
