const Hub = require('../models/Hub');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// GET /api/hubs
exports.getAllHubs = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const hubs = await Hub.find();
      return res.status(200).json({
        success: true,
        count: hubs.length,
        gpsRadiusActive: true,
        cctvStatus: '24/7 Monitored',
        data: hubs
      });
    }

    res.status(200).json({
      success: true,
      count: memoryStore.hubs.length,
      gpsRadiusActive: true,
      cctvStatus: '24/7 Monitored',
      data: memoryStore.hubs
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/hubs/safety-pledge
exports.getSafetyPledge = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        title: 'Trade with total peace of mind.',
        verifiedZonesCount: 14,
        scamShieldSteps: [
          { step: 1, title: 'Locked in Escrow', desc: 'Funds held safely until handoff is confirmed' },
          { step: 2, title: 'Physical Scan Check', desc: 'Item verified at designated campus hub' },
          { step: 3, title: 'Direct Deposit', desc: 'Instant transfer to seller after confirmation' }
        ],
        dataProtection: [
          'FERPA Directory Compliance',
          'End-to-End Cryptographic Vault',
          'Zero 3rd-Party Commercial Tracking'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};
