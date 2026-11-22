const Wishlist = require('../models/Wishlist');
const Watchlist = require('../models/Watchlist');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const items = await Wishlist.find({ userId: 'me' }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: items.length,
        potentialSavings: 35,
        data: items
      });
    }

    res.status(200).json({
      success: true,
      count: memoryStore.wishlist.length,
      potentialSavings: 35,
      data: memoryStore.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { title, price, seller, initials, avCls, hub, label, condition, desc } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and price to add to wishlist'
      });
    }

    const itemData = {
      userId: 'me',
      title,
      price: Number(price),
      seller: seller || 'Cal Student',
      initials: initials || 'CS',
      avCls: avCls || 'avatar-ml',
      drop: 'Price Alert Active',
      dropCls: 'price-drop-green',
      hub: hub || 'Campus Hub',
      label: label || 'SAVED ITEM',
      condition: condition || 'Good',
      desc: desc || '',
      grad: 'linear-gradient(135deg,#c8a060,#8a6030)',
      btn1: 'Buy / Hold Escrow',
      btn1Cls: 'btn-success',
      btn2: `Message ${seller ? seller.split(' ')[0] : 'Seller'}`
    };

    if (getIsConnected()) {
      const item = await Wishlist.create(itemData);
      return res.status(201).json({
        success: true,
        message: 'Item added to campus wishlist',
        data: item
      });
    }

    const mockItem = {
      _id: `wish_${Date.now()}`,
      id: `w_${Date.now()}`,
      ...itemData,
      createdAt: new Date().toISOString()
    };
    memoryStore.wishlist.unshift(mockItem);

    res.status(201).json({
      success: true,
      message: 'Item added to campus wishlist (in-memory)',
      data: mockItem
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/:id
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      await Wishlist.findOneAndDelete({ $or: [{ _id: id }, { id: id }] });
      return res.status(200).json({ success: true, message: 'Item removed from wishlist' });
    }

    const idx = memoryStore.wishlist.findIndex(item => item._id === id || item.id === id);
    if (idx !== -1) {
      memoryStore.wishlist.splice(idx, 1);
    }

    res.status(200).json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

// GET /api/wishlist/watchlists
exports.getWatchlists = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const lists = await Watchlist.find({ userId: 'me' });
      return res.status(200).json({ success: true, count: lists.length, data: lists });
    }

    res.status(200).json({
      success: true,
      count: memoryStore.watchlists.length,
      data: memoryStore.watchlists
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist/watchlists
exports.createWatchlist = async (req, res, next) => {
  try {
    const { course, title, maxPrice } = req.body;

    if (!course || !title || !maxPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course code, course title, and target max price'
      });
    }

    const watchData = {
      userId: 'me',
      course,
      title,
      maxPrice: Number(maxPrice),
      autoNotify: true,
      status: 'Monitoring',
      notifications: ['Auto-tracking started', 'Watching Berkeley student drops']
    };

    if (getIsConnected()) {
      const created = await Watchlist.create(watchData);
      return res.status(201).json({ success: true, data: created });
    }

    const mockItem = {
      _id: `wtch_${Date.now()}`,
      id: `cw_${Date.now()}`,
      ...watchData,
      createdAt: new Date().toISOString()
    };
    memoryStore.watchlists.push(mockItem);

    res.status(201).json({ success: true, data: mockItem });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/wishlist/watchlists/:id/toggle-notify
exports.toggleAutoNotify = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const watch = await Watchlist.findById(id);
      if (!watch) {
        return res.status(404).json({ success: false, message: 'Watchlist not found' });
      }
      watch.autoNotify = !watch.autoNotify;
      await watch.save();
      return res.status(200).json({ success: true, autoNotify: watch.autoNotify });
    }

    const watch = memoryStore.watchlists.find(w => w._id === id || w.id === id);
    if (!watch) {
      return res.status(404).json({ success: false, message: 'Watchlist not found' });
    }
    watch.autoNotify = !watch.autoNotify;

    res.status(200).json({ success: true, autoNotify: watch.autoNotify });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/watchlists/:id
exports.deleteWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      await Watchlist.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Watchlist alert removed' });
    }

    const idx = memoryStore.watchlists.findIndex(w => w._id === id || w.id === id);
    if (idx !== -1) {
      memoryStore.watchlists.splice(idx, 1);
    }

    res.status(200).json({ success: true, message: 'Watchlist alert removed' });
  } catch (error) {
    next(error);
  }
};
