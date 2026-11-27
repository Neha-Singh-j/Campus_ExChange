const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Watchlist = require('../models/Watchlist');
const Listing = require('../models/Listing');
const AppError = require('../utils/AppError');
const { SELLER_FIELDS, serializeListing } = require('../utils/serializers');

const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const bad = (message) => new AppError(400, message, 'VALIDATION');

// GET /api/wishlist  -> the signed-in user's saved listings (newest first)
exports.getWishlist = async (req, res) => {
  const rows = await Wishlist.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: 'listing', populate: { path: 'sellerId', select: SELLER_FIELDS } })
    .lean();

  const wishIds = new Set(rows.filter((r) => r.listing).map((r) => r.listing._id.toString()));
  const data = rows
    .filter((r) => r.listing) // listing may have been deleted
    .map((r) => serializeListing(r.listing, { viewer: req.user, wishIds }));
  res.json({ success: true, count: data.length, data });
};

// POST /api/wishlist   body: { listingId }
exports.addToWishlist = async (req, res) => {
  const { listingId } = req.body;
  if (!isId(listingId)) throw bad('Please choose an item to save.');
  const exists = await Listing.exists({ _id: listingId });
  if (!exists) throw new AppError(404, 'Listing not found.', 'NOT_FOUND');

  await Wishlist.updateOne(
    { user: req.user._id, listing: listingId },
    { $setOnInsert: { user: req.user._id, listing: listingId } },
    { upsert: true }
  );
  res.status(201).json({ success: true, message: 'Saved to your wishlist.' });
};

// DELETE /api/wishlist/:listingId
exports.removeFromWishlist = async (req, res) => {
  if (!isId(req.params.listingId)) throw bad('Invalid item.');
  await Wishlist.deleteOne({ user: req.user._id, listing: req.params.listingId });
  res.json({ success: true, message: 'Removed from your wishlist.' });
};

// ---------------- course watchlists (per user) ----------------

// GET /api/wishlist/watchlists
exports.getWatchlists = async (req, res) => {
  const lists = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: lists.length, data: lists.map((w) => ({ ...w, id: w._id.toString() })) });
};

// POST /api/wishlist/watchlists
exports.createWatchlist = async (req, res) => {
  const course = String(req.body.course || '').trim().slice(0, 40);
  const title = String(req.body.title || '').trim().slice(0, 120);
  const maxPrice = Number(req.body.maxPrice);
  if (!course || !title || !Number.isFinite(maxPrice) || maxPrice < 0) {
    throw bad('Please provide a course code, a title and a maximum price.');
  }
  const created = await Watchlist.create({
    user: req.user._id,
    course,
    title,
    maxPrice,
    notifications: ['Auto-tracking started'],
  });
  res.status(201).json({ success: true, data: { ...created.toObject(), id: created._id.toString() } });
};

// PATCH /api/wishlist/watchlists/:id/toggle-notify
exports.toggleAutoNotify = async (req, res) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Watchlist not found.', 'NOT_FOUND');
  const watch = await Watchlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!watch) throw new AppError(404, 'Watchlist not found.', 'NOT_FOUND');
  watch.autoNotify = !watch.autoNotify;
  await watch.save();
  res.json({ success: true, autoNotify: watch.autoNotify });
};

// DELETE /api/wishlist/watchlists/:id
exports.deleteWatchlist = async (req, res) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Watchlist not found.', 'NOT_FOUND');
  await Watchlist.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ success: true, message: 'Watchlist removed.' });
};
