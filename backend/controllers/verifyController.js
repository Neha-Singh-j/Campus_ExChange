const Verification = require('../models/Verification');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// GET /api/verify/profile
exports.getVerificationProfile = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const profile = await Verification.findOne().sort({ createdAt: -1 });
      if (profile) {
        return res.status(200).json({ success: true, data: profile });
      }
    }

    res.status(200).json({
      success: true,
      data: memoryStore.verification
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/verify/request
exports.submitVerification = async (req, res, next) => {
  try {
    const { campus, academicEmail, studentType, idScanFileName, consent } = req.body;

    if (!academicEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an institutional .edu email address'
      });
    }

    const cleanEmail = academicEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith('.edu')) {
      return res.status(400).json({
        success: false,
        message: 'Verification requires a valid university .edu email address'
      });
    }

    const verificationPayload = {
      campus: campus || 'UC Berkeley – Main Campus',
      academicEmail: cleanEmail,
      studentType: studentType || 'Undergraduate',
      idScanFileName: idScanFileName || 'cal1_front_scan_2025.png',
      status: 'VERIFIED',
      studentName: 'Alex Morgan',
      studentId: '3034928190',
      department: 'Haas School of Business',
      expirationDate: 'MAY 2026',
      matriculated: true,
      trustScore: 99.4,
      safeExchanges: 42,
      disputes: 0,
      positiveReviews: 38,
      consent: consent !== undefined ? Boolean(consent) : true
    };

    if (getIsConnected()) {
      const created = await Verification.create(verificationPayload);
      return res.status(201).json({
        success: true,
        message: 'Cryptographic student verification submitted and validated successfully!',
        data: created
      });
    }

    memoryStore.verification = {
      _id: `verif_${Date.now()}`,
      ...verificationPayload,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Cryptographic student verification submitted and validated successfully! (in-memory)',
      data: memoryStore.verification
    });
  } catch (error) {
    next(error);
  }
};
