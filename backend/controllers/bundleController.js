const Bundle = require('../models/Bundle');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// GET /api/bundles
exports.getAllBundles = async (req, res, next) => {
  try {
    const { cat, zone, sweetSpot, dollyOnly, seniorOnly } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (cat && cat !== 'all') {
        query.cat = cat;
      }
      if (zone && zone !== 'All Campus Zones') {
        query.zone = { $regex: zone, $options: 'i' };
      }
      if (sweetSpot === 'true') {
        query.price = { $gte: 50, $lte: 150 };
      }
      if (dollyOnly === 'true') {
        query.includesDolly = true;
      }
      if (seniorOnly === 'true') {
        query['seller.isSenior'] = true;
      }

      const bundles = await Bundle.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: bundles.length,
        data: bundles
      });
    }

    let results = [...memoryStore.bundles];
    if (cat && cat !== 'all') {
      results = results.filter(b => b.cat === cat);
    }
    if (zone && zone !== 'All Campus Zones') {
      results = results.filter(b => b.zone.toLowerCase().includes(zone.toLowerCase()));
    }
    if (sweetSpot === 'true') {
      results = results.filter(b => b.price >= 50 && b.price <= 150);
    }
    if (dollyOnly === 'true') {
      results = results.filter(b => b.includesDolly);
    }
    if (seniorOnly === 'true') {
      results = results.filter(b => b.seller && b.seller.isSenior);
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bundles/:id
exports.getBundleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const bundle = await Bundle.findById(id);
      if (!bundle) {
        return res.status(404).json({ success: false, message: 'Bundle not found' });
      }
      return res.status(200).json({ success: true, data: bundle });
    }

    const bundle = memoryStore.bundles.find(b => b._id === id);
    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }

    res.status(200).json({ success: true, data: bundle });
  } catch (error) {
    next(error);
  }
};

// POST /api/bundles
exports.createBundle = async (req, res, next) => {
  try {
    const { title, price, retailPrice, items, note, zone, cat, includesDolly } = req.body;

    if (!title || price === undefined || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, price, and at least one item in the bundle'
      });
    }

    const numPrice = Number(price);
    const numRetail = Number(retailPrice) || Math.round(numPrice * 2.8);
    const savings = numRetail - numPrice;

    const bundleData = {
      title,
      price: numPrice,
      retailPrice: numRetail,
      savings,
      items: Array.isArray(items) ? items : [items],
      note: note || 'Complete dorm setup from a graduating senior.',
      seller: {
        name: 'Senior Cal Grad',
        major: "EECS '25",
        initials: 'SG',
        avCls: 'avatar-dk',
        isSenior: true
      },
      cat: cat || 'dorm',
      zone: zone || 'Unit 2 Towle Hall Loading Zone',
      includesDolly: includesDolly !== undefined ? Boolean(includesDolly) : true,
      grad: 'linear-gradient(135deg,#8a9db8,#5a7290)',
      claimed: false
    };

    if (getIsConnected()) {
      const created = await Bundle.create(bundleData);
      return res.status(201).json({
        success: true,
        message: 'Move-out bundle created successfully',
        data: created
      });
    }

    const mockItem = {
      _id: `bndl_${Date.now()}`,
      ...bundleData,
      createdAt: new Date().toISOString()
    };
    memoryStore.bundles.unshift(mockItem);

    res.status(201).json({
      success: true,
      message: 'Move-out bundle created successfully (in-memory)',
      data: mockItem
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/bundles/:id/claim
exports.claimBundle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const bundle = await Bundle.findById(id);
      if (!bundle) {
        return res.status(404).json({ success: false, message: 'Bundle not found' });
      }
      bundle.claimed = true;
      await bundle.save();
      return res.status(200).json({
        success: true,
        message: 'Bundle claimed successfully! Escrow hold initiated for pickup.',
        data: bundle
      });
    }

    const bundle = memoryStore.bundles.find(b => b._id === id);
    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }
    bundle.claimed = true;

    res.status(200).json({
      success: true,
      message: 'Bundle claimed successfully! Escrow hold initiated for pickup.',
      data: bundle
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bundles/stats/overview
exports.getBundleStats = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        countdownTarget: '2025-05-22T23:59:59Z',
        avgSavings: '$340',
        totalSetups: 142,
        verifiedSeniors: '100%'
      }
    });
  } catch (error) {
    next(error);
  }
};
