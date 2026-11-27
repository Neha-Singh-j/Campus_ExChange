const mongoose = require('mongoose');
const Wanted = require('../models/Wanted');
const config = require('../config');
const AppError = require('../utils/AppError');
const { notifyQuietly } = require('../utils/mailer');
const { escapeRegex } = require('../utils/validators');
const { SELLER_FIELDS, serializeWanted, publicUser } = require('../utils/serializers');

const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const bad = (message) => new AppError(400, message, 'VALIDATION');
const text = (v, max) => String(v ?? '').trim().slice(0, max);

const loadOwned = async (req) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Request not found.', 'NOT_FOUND');
  const item = await Wanted.findById(req.params.id);
  if (!item) throw new AppError(404, 'Request not found.', 'NOT_FOUND');
  if (!item.user.equals(req.user._id) && req.user.role !== 'admin') {
    throw new AppError(403, 'You can only change your own requests.', 'FORBIDDEN');
  }
  return item;
};

// GET /api/wanted   (public)
exports.getAllWanted = async (req, res) => {
  const q = { campusId: req.query.campusId || req.user?.campusId || config.campusId, status: 'open' };
  if (req.query.category) q.category = String(req.query.category);
  if (req.query.mine === 'true' && req.user) q.user = req.user._id;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(String(req.query.search).slice(0, 80)), 'i');
    q.$or = [{ title: rx }, { desc: rx }, { category: rx }];
  }

  const items = await Wanted.find(q).sort({ createdAt: -1 }).limit(100).populate('user', SELLER_FIELDS).lean();
  res.json({ success: true, count: items.length, data: items.map((w) => serializeWanted(w, { viewer: req.user })) });
};

// GET /api/wanted/:id
exports.getWanted = async (req, res) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Request not found.', 'NOT_FOUND');
  const item = await Wanted.findById(req.params.id).populate('user', SELLER_FIELDS).lean();
  if (!item) throw new AppError(404, 'Request not found.', 'NOT_FOUND');
  res.json({ success: true, data: serializeWanted(item, { viewer: req.user }) });
};

// POST /api/wanted
exports.createWanted = async (req, res) => {
  const b = req.body;
  const title = text(b.title, 140);
  const budget = text(b.budget, 40);
  if (title.length < 3) throw bad('Please describe what you are looking for.');
  if (!budget) throw bad('Please enter your budget.');

  const created = await Wanted.create({
    user: req.user._id,
    campusId: req.user.campusId,
    title,
    budget,
    desc: text(b.description ?? b.desc, 1500),
    zone: text(b.campus ?? b.zone, 120) || 'Main Campus',
    urgency: text(b.urgency, 60) || 'Flexible',
    category: text(b.category, 60) || 'Textbooks & Notes',
  });
  await created.populate('user', SELLER_FIELDS);
  res.status(201).json({
    success: true,
    message: 'Your request is live on the board.',
    data: serializeWanted(created.toObject(), { viewer: req.user }),
  });
};

// POST /api/wanted/:id/offer   body: { amount?, message }
exports.submitOffer = async (req, res) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Request not found.', 'NOT_FOUND');
  const item = await Wanted.findById(req.params.id).populate('user', 'name email campusId');
  if (!item || item.status !== 'open') throw new AppError(404, 'This request is no longer open.', 'NOT_FOUND');
  if (item.user._id.equals(req.user._id)) throw bad('You cannot offer on your own request.');
  if (item.campusId !== req.user.campusId) throw new AppError(403, 'This request is on a different campus.', 'FORBIDDEN');
  if (item.offers.some((o) => o.user.equals(req.user._id))) {
    throw new AppError(409, 'You already sent an offer for this request.', 'OFFER_EXISTS');
  }

  const message = text(req.body.message, 500);
  if (!message) throw bad('Please add a short message for the student.');
  const amount = req.body.amount === undefined || req.body.amount === '' ? undefined : Number(req.body.amount);
  if (amount !== undefined && (!Number.isFinite(amount) || amount < 0 || amount > 1000000)) {
    throw bad('Please enter a valid amount.');
  }

  item.offers.push({ user: req.user._id, amount, message });
  await item.save();

  notifyQuietly(
    item.user.email,
    `New offer for "${item.title}"`,
    `Hi ${item.user.name},\n\n${req.user.name} sent an offer${amount !== undefined ? ` of ${amount}` : ''} for your request "${item.title}".\n\nMessage: ${message}\n\nOpen Campus Exchange to see all offers.\n`
  );
  res.status(201).json({ success: true, message: 'Your offer was sent to the student.' });
};

// GET /api/wanted/:id/offers   (request owner only)
exports.getOffers = async (req, res) => {
  const item = await loadOwned(req);
  await item.populate('offers.user', SELLER_FIELDS);
  res.json({
    success: true,
    data: item.offers.map((o) => ({
      id: o._id.toString(),
      from: publicUser(o.user),
      amount: o.amount ?? null,
      message: o.message,
      createdAt: o.createdAt,
    })),
  });
};

// PATCH /api/wanted/:id/status   body: { status: 'fulfilled' | 'closed' }
exports.setStatus = async (req, res) => {
  const item = await loadOwned(req);
  if (!['fulfilled', 'closed'].includes(req.body.status)) throw bad('Status must be fulfilled or closed.');
  item.status = req.body.status;
  await item.save();
  res.json({ success: true, message: 'Request updated.' });
};

// DELETE /api/wanted/:id
exports.deleteWanted = async (req, res) => {
  const item = await loadOwned(req);
  await item.deleteOne();
  res.json({ success: true, message: 'Request deleted.' });
};
