const Listing = require('../models/Listing');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');
const {
  listOrders,
  listUsers,
  setUserActive,
  publicUser,
  setVerificationStatus,
  getIdProofImage
} = require('../utils/dataStore');

const round2 = (n) => Math.round(n * 100) / 100;

// GET /api/admin/overview  -> totals, average rate, per-category/seller summaries
exports.getOverview = async (req, res, next) => {
  try {
    const [orders, users] = await Promise.all([listOrders(), listUsers()]);
    const listingCount = getIsConnected() ? await Listing.countDocuments() : memoryStore.listings.length;

    const completed = orders.filter((o) => o.status === 'completed');
    const revenue = completed.reduce((sum, o) => sum + o.price, 0);
    const listValue = completed.reduce((sum, o) => sum + (o.originalPrice || o.price), 0);

    const bySeller = {};
    completed.forEach((o) => {
      const key = o.sellerName || 'Unknown';
      bySeller[key] = bySeller[key] || { seller: key, sales: 0, revenue: 0 };
      bySeller[key].sales += 1;
      bySeller[key].revenue += o.price;
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers: users.length,
        totalListings: listingCount,
        totalOrders: orders.length,
        totalRevenue: round2(revenue),
        averageOrderValue: completed.length ? round2(revenue / completed.length) : 0,
        // Average discount buyers got versus the original price
        averageDiscountPct: listValue > 0 ? round2((1 - revenue / listValue) * 100) : 0,
        topSellers: Object.values(bySeller).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders  -> every purchase: item, buyer, seller, price vs original ("rate")
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await listOrders();
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/listings  -> everything currently for sale, with price and seller
exports.getListings = async (req, res, next) => {
  try {
    const items = getIsConnected() ? await Listing.find().sort({ createdAt: -1 }).lean() : memoryStore.listings;
    const data = items.map((l) => {
      const original = l.originalPrice || l.origPrice || l.price;
      return {
        id: l.id || String(l._id),
        title: l.title,
        price: l.price,
        originalPrice: original,
        discountPct: original > 0 ? Math.max(0, Math.round((1 - l.price / original) * 100)) : 0,
        category: l.category || l.cat,
        condition: l.condition,
        sellerName: l.seller?.name || 'Campus Seller',
        sellerId: l.sellerId || null,
        createdAt: l.createdAt
      };
    });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await listUsers();
    res.status(200).json({ success: true, count: users.length, data: users.map(publicUser) });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/active   body: { isActive: boolean }
exports.setUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }
    const updated = await setUserActive(req.params.id, Boolean(req.body?.isActive));
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: publicUser(updated) });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/verification   body: { status: 'VERIFIED' | 'REJECTED' | 'PENDING' }
exports.setVerification = async (req, res, next) => {
  try {
    const status = String(req.body?.status || '').toUpperCase();
    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be VERIFIED, REJECTED or PENDING' });
    }
    const updated = await setVerificationStatus(req.params.id, status);
    if (!updated || !updated.studentProfile) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: publicUser(updated) });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id/id-proof  -> the student's ID card photo (data URL)
exports.getIdProof = async (req, res, next) => {
  try {
    const image = await getIdProofImage(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'No ID photo on file for this user' });
    }
    res.status(200).json({ success: true, data: { image } });
  } catch (error) {
    next(error);
  }
};
