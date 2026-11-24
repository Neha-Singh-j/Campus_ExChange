const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const Bundle = require('../models/Bundle');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');
const { createOrder, listOrders, findOrderById, updateOrderStatus } = require('../utils/dataStore');

const findListing = async (id) => {
  if (getIsConnected()) {
    const query = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ _id: id }, { id }] } : { id };
    return Listing.findOne(query);
  }
  return memoryStore.listings.find((l) => l._id === id || l.id === id) || null;
};

// Bundles can be found by the string id (e.g. "bundle-1") or the database _id
const findBundle = async (id) => {
  if (getIsConnected()) {
    const query = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ id }, { _id: id }] } : { id };
    return Bundle.findOne(query);
  }
  return memoryStore.bundles.find((b) => b._id === id || b.id === id) || null;
};

// Builds and stores an order. The price always comes from the stored item,
// never from the client, so buyers can't set their own rate.
const recordOrder = async ({ itemType, item, buyer, status = 'pending' }) => {
  const price = Number(item.price) || 0;
  const original = Number(itemType === 'bundle' ? item.retailPrice : item.originalPrice || item.origPrice) || price;
  const discountPct = original > 0 ? Math.max(0, Math.round((1 - price / original) * 100)) : 0;

  return createOrder({
    itemType,
    itemId: String(item._id),
    title: item.title,
    originalPrice: original,
    price,
    discountPct,
    buyerId: buyer.id,
    buyerName: buyer.name,
    buyerEmail: buyer.email,
    sellerId: item.sellerId || null,
    sellerName: item.seller?.name || 'Campus Seller',
    meetupLocation: item.meetupLocation || item.loc || item.zone || '',
    status
  });
};

// POST /api/orders   body: { itemType: 'listing' | 'bundle', itemId }
exports.createOrderHandler = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.body || {};
    if (!['listing', 'bundle'].includes(itemType) || !itemId) {
      return res.status(400).json({ success: false, message: "itemType ('listing' or 'bundle') and itemId are required" });
    }

    const item = itemType === 'listing' ? await findListing(String(itemId)) : await findBundle(String(itemId));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (item.sellerId && String(item.sellerId) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot buy your own item' });
    }
    if (itemType === 'bundle' && item.claimed) {
      return res.status(409).json({ success: false, message: 'This bundle has already been claimed' });
    }

    const order = await recordOrder({ itemType, item, buyer: req.user });

    if (itemType === 'bundle') {
      item.claimed = true;
      item.claimedBy = req.user.id;
      if (typeof item.save === 'function') await item.save();
    }

    res.status(201).json({ success: true, message: 'Purchase recorded', data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/mine  -> orders where I'm the buyer or the seller
exports.getMyOrders = async (req, res, next) => {
  try {
    const [bought, sold] = await Promise.all([
      listOrders({ buyerId: req.user.id }),
      listOrders({ sellerId: req.user.id })
    ]);
    res.status(200).json({ success: true, data: { bought, sold } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/complete  -> the in-person handshake finished (buyer or admin only)
exports.completeOrder = async (req, res, next) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the buyer can complete this order' });
    }
    if (order.status !== 'pending') {
      return res.status(409).json({ success: false, message: `Order is already ${order.status}` });
    }
    const updated = await updateOrderStatus(order._id, 'completed');
    res.status(200).json({ success: true, message: 'Order completed', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.findBundle = findBundle;
exports.recordOrder = recordOrder;
