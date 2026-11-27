const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const Wishlist = require('../models/Wishlist');
const Offer = require('../models/Offer');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');
const { saveImages, deleteImages } = require('../utils/imageStore');
const { closeOffersForListing } = require('../utils/offerHelpers');
const { notifyWatchers } = require('../utils/watchers');
const { escapeRegex } = require('../utils/validators');
const { SELLER_FIELDS, serializeListing } = require('../utils/serializers');

const { CATEGORIES, CONDITIONS, STATUSES } = Listing;
const MAX_IMAGES = config.limits.maxImages;

const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const bad = (message) => new AppError(400, message, 'VALIDATION');

// ---------- helpers ----------

const wishlistedSet = async (viewer, listings) => {
  if (!viewer || listings.length === 0) return new Set();
  const rows = await Wishlist.find({ user: viewer._id, listing: { $in: listings.map((l) => l._id) } })
    .select('listing')
    .lean();
  return new Set(rows.map((r) => r.listing.toString()));
};

const loadOwned = async (req) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Listing not found.', 'NOT_FOUND');
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError(404, 'Listing not found.', 'NOT_FOUND');
  const isOwner = listing.sellerId.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new AppError(403, 'You can only change your own listings.', 'FORBIDDEN');
  }
  return listing;
};

const parseTags = (value) => {
  let arr = value;
  if (typeof value === 'string') {
    try {
      arr = JSON.parse(value);
    } catch {
      arr = value.split(',');
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr.map((t) => String(t).trim().slice(0, 30)).filter(Boolean).slice(0, 8);
};

const optionalNumber = (value, label, max) => {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max) throw bad(`${label} must be a number between 0 and ${max}.`);
  return n;
};

/** Reads + validates listing fields from a (multipart) body. Only validates fields that are present unless requireAll. */
const readFields = (b, { requireAll }) => {
  const out = {};
  const has = (k) => requireAll || b[k] !== undefined;

  if (has('title')) {
    const t = String(b.title || '').trim();
    if (t.length < 3 || t.length > 120) throw bad('Title must be 3-120 characters.');
    out.title = t;
  }
  if (has('price')) {
    const p = optionalNumber(b.price, 'Price', 1000000);
    if (p === undefined) throw bad('Please enter a price.');
    out.price = p;
  }
  if (b.originalPrice !== undefined) out.originalPrice = optionalNumber(b.originalPrice, 'Original price', 10000000) ?? null;
  if (has('category')) {
    if (!CATEGORIES.includes(b.category)) throw bad('Please choose a valid category.');
    out.category = b.category;
  }
  if (b.condition !== undefined || requireAll) {
    const c = b.condition || 'Good';
    if (!CONDITIONS.includes(c)) throw bad('Please choose a valid condition.');
    out.condition = c;
  }
  if (b.desc !== undefined || b.description !== undefined) {
    out.desc = String(b.desc ?? b.description).trim().slice(0, 2000);
  }
  if (b.courseCode !== undefined) out.courseCode = String(b.courseCode).trim().slice(0, 40);
  if (b.conditionBadge !== undefined) out.conditionBadge = String(b.conditionBadge).trim().slice(0, 120);
  if (has('meetupLocation')) {
    const m = String(b.meetupLocation || '').trim();
    if (!m || m.length > 120) throw bad('Please choose a meetup location.');
    out.meetupLocation = m;
  }
  if (b.tags !== undefined) out.tags = parseTags(b.tags);
  return out;
};

const attachOfferCounts = async (serialized) => {
  if (serialized.length === 0) return serialized;
  const rows = await Offer.aggregate([
    { $match: { listing: { $in: serialized.map((l) => new mongoose.Types.ObjectId(l.id)) }, status: 'open' } },
    { $group: { _id: '$listing', n: { $sum: 1 } } },
  ]);
  const counts = new Map(rows.map((r) => [r._id.toString(), r.n]));
  return serialized.map((l) => ({ ...l, openOffers: counts.get(l.id) || 0 }));
};

const SORTS = {
  price_asc: { price: 1 },
  'Price: Low to High': { price: 1 },
  low: { price: 1 },
  price_desc: { price: -1 },
  'Price: High to Low': { price: -1 },
  high: { price: -1 },
};

// ---------- handlers ----------

// GET /api/listings   (public; signed-in users also get isWishlisted / isOwner)
exports.getListings = async (req, res) => {
  const { category, condition, search, minPrice, maxPrice, sort, status } = req.query;
  const q = { campusId: req.query.campusId || req.user?.campusId || config.campusId };

  q.status = STATUSES.includes(status) ? status : { $in: ['available', 'reserved'] };
  if (category && CATEGORIES.includes(category)) q.category = category;
  if (condition && CONDITIONS.includes(condition)) q.condition = condition;

  const min = optionalNumber(minPrice, 'Minimum price', 1e9);
  const max = optionalNumber(maxPrice, 'Maximum price', 1e9);
  if (min !== undefined || max !== undefined) {
    q.price = {};
    if (min !== undefined) q.price.$gte = min;
    if (max !== undefined) q.price.$lte = max;
  }
  if (search) {
    const rx = new RegExp(escapeRegex(String(search).slice(0, 80)), 'i');
    q.$or = [{ title: rx }, { desc: rx }, { courseCode: rx }, { tags: rx }];
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 48));

  const [items, total] = await Promise.all([
    Listing.find(q)
      .sort(SORTS[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sellerId', SELLER_FIELDS)
      .lean(),
    Listing.countDocuments(q),
  ]);

  const wishIds = await wishlistedSet(req.user, items);
  res.json({
    success: true,
    count: items.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: items.map((l) => serializeListing(l, { viewer: req.user, wishIds })),
  });
};

// GET /api/listings/mine
exports.getMine = async (req, res) => {
  const items = await Listing.find({ sellerId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('sellerId', SELLER_FIELDS)
    .lean();
  const serialized = items.map((l) => serializeListing(l, { viewer: req.user }));
  res.json({ success: true, data: await attachOfferCounts(serialized) });
};

// GET /api/listings/:id
exports.getListing = async (req, res) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Listing not found.', 'NOT_FOUND');
  const listing = await Listing.findById(req.params.id).populate('sellerId', SELLER_FIELDS).lean();
  if (!listing) throw new AppError(404, 'Listing not found.', 'NOT_FOUND');
  const wishIds = await wishlistedSet(req.user, [listing]);
  res.json({ success: true, data: serializeListing(listing, { viewer: req.user, wishIds }) });
};

// POST /api/listings   (multipart/form-data, images in the "images" field)
exports.createListing = async (req, res) => {
  const fields = readFields(req.body, { requireAll: true });
  const images = await saveImages(req.files || []);

  let listing;
  try {
    listing = await Listing.create({
      ...fields,
      images,
      sellerId: req.user._id,
      campusId: req.user.campusId,
    });
  } catch (err) {
    await deleteImages(images); // don't leave orphaned files behind
    throw err;
  }

  notifyWatchers(listing); // email students whose course watchlist matches (not awaited)

  await listing.populate('sellerId', SELLER_FIELDS);
  res.status(201).json({
    success: true,
    message: 'Your item is now listed.',
    data: serializeListing(listing.toObject(), { viewer: req.user }),
  });
};

// PATCH /api/listings/:id   (owner only; multipart; optional removeImages = JSON array of image publicIds)
exports.updateListing = async (req, res) => {
  const listing = await loadOwned(req);
  if (listing.status === 'sold') throw new AppError(409, 'Sold listings cannot be edited.', 'LISTING_SOLD');

  const fields = readFields(req.body, { requireAll: false });
  let removeIds = [];
  if (req.body.removeImages) {
    try {
      removeIds = JSON.parse(req.body.removeImages);
    } catch {
      throw bad('removeImages must be a JSON array.');
    }
    if (!Array.isArray(removeIds)) throw bad('removeImages must be a JSON array.');
  }

  const kept = listing.images.filter((img) => !removeIds.includes(img.publicId));
  const removed = listing.images.filter((img) => removeIds.includes(img.publicId));
  const newFiles = req.files || [];
  if (kept.length + newFiles.length > MAX_IMAGES) throw bad(`A listing can have at most ${MAX_IMAGES} photos.`);

  const added = await saveImages(newFiles);
  Object.assign(listing, fields);
  if (fields.originalPrice === null) listing.originalPrice = undefined;
  listing.images = [...kept, ...added];

  try {
    await listing.save();
  } catch (err) {
    await deleteImages(added);
    throw err;
  }
  await deleteImages(removed);

  await listing.populate('sellerId', SELLER_FIELDS);
  res.json({ success: true, data: serializeListing(listing.toObject(), { viewer: req.user }) });
};

// PATCH /api/listings/:id/status   body: { status: 'available' | 'reserved' | 'sold' }
exports.setStatus = async (req, res) => {
  const listing = await loadOwned(req);
  const next = req.body.status;
  if (!STATUSES.includes(next)) throw bad('Status must be available, reserved or sold.');
  if (listing.status === 'sold') throw new AppError(409, 'Sold listings cannot be changed.', 'LISTING_SOLD');

  if (next !== listing.status) {
    if (next === 'sold') {
      listing.soldAt = new Date();
      await closeOffersForListing(listing._id, { completeAccepted: true, reason: 'Seller marked the item as sold.' });
    } else {
      await closeOffersForListing(listing._id, {
        reason: next === 'reserved' ? 'Seller reserved the item.' : 'Seller put the item back on the market.',
      });
    }
    if (next !== 'reserved') {
      listing.reservedFor = undefined;
      listing.agreedPrice = undefined;
    }
    listing.status = next;
    await listing.save();
  }

  await listing.populate('sellerId', SELLER_FIELDS);
  res.json({ success: true, data: serializeListing(listing.toObject(), { viewer: req.user }) });
};

// DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  const listing = await loadOwned(req);

  await closeOffersForListing(listing._id, { reason: 'The listing was removed by the seller.' });
  await Wishlist.deleteMany({ listing: listing._id });
  await listing.deleteOne();
  await deleteImages(listing.images);

  res.json({ success: true, message: 'Listing deleted.' });
};

// GET /api/listings/stats/summary
exports.getStats = async (req, res) => {
  const campusId = req.query.campusId || req.user?.campusId || config.campusId;
  const [activeListings, completedHandoffs, verifiedStudents] = await Promise.all([
    Listing.countDocuments({ campusId, status: 'available' }),
    Listing.countDocuments({ campusId, status: 'sold' }),
    User.countDocuments({ campusId, isVerified: true }),
  ]);
  res.json({ success: true, data: { activeListings, completedHandoffs, verifiedStudents } });
};
