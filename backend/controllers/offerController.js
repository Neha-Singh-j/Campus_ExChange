const mongoose = require('mongoose');
const Offer = require('../models/Offer');
const Listing = require('../models/Listing');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');
const { notifyQuietly } = require('../utils/mailer');
const { SELLER_FIELDS, serializeOffer } = require('../utils/serializers');

const MAX_ROUNDS = config.limits.maxOfferRounds;
const isId = (id) => mongoose.Types.ObjectId.isValid(id);
const bad = (message) => new AppError(400, message, 'VALIDATION');
const conflict = (message, code = 'OFFER_STATE') => new AppError(409, message, code);

const populateOffer = (query) =>
  query
    .populate('listing', 'title images price status category meetupLocation')
    .populate('buyer', SELLER_FIELDS)
    .populate('seller', SELLER_FIELDS);

const readAmount = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 1000000) throw bad('Please enter a valid amount greater than 0.');
  return Math.round(n * 100) / 100;
};

const cleanMessage = (value) => String(value || '').trim().slice(0, 500);

const roleOf = (offer, user) => (offer.buyer.equals(user._id) ? 'buyer' : 'seller');

/** Loads an offer the signed-in user is a party to; anyone else gets a 404. */
const loadMyOffer = async (req) => {
  if (!isId(req.params.id)) throw new AppError(404, 'Offer not found.', 'NOT_FOUND');
  const offer = await Offer.findById(req.params.id);
  if (!offer || !(offer.buyer.equals(req.user._id) || offer.seller.equals(req.user._id))) {
    throw new AppError(404, 'Offer not found.', 'NOT_FOUND');
  }
  return offer;
};

const respondWith = async (res, offerId, viewer, extra = {}, status = 200) => {
  const fresh = await populateOffer(Offer.findById(offerId));
  res.status(status).json({ success: true, ...extra, data: serializeOffer(fresh, viewer._id) });
};

/** Emails the other party (never blocks or fails the request). */
const notifyOther = (offer, toRole, subject, body) => {
  User.findById(toRole === 'buyer' ? offer.buyer : offer.seller)
    .select('email name')
    .then((u) => {
      if (u) notifyQuietly(u.email, subject, `Hi ${u.name},\n\n${body}\n\nOpen Campus Exchange to respond.\n`);
    })
    .catch((err) => console.warn('[offers] notify failed:', err.message));
};

const historyEntry = (action, role, user, extra = {}) => ({
  action,
  role,
  by: user ? user._id : undefined,
  at: new Date(),
  ...extra,
});

// POST /api/offers   body: { listingId, amount, message }
exports.createOffer = async (req, res) => {
  const { listingId } = req.body;
  if (!isId(listingId)) throw bad('Please choose an item to make an offer on.');
  const amount = readAmount(req.body.amount);
  const message = cleanMessage(req.body.message);

  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError(404, 'Listing not found.', 'NOT_FOUND');
  if (listing.sellerId.equals(req.user._id)) throw bad('You cannot make an offer on your own listing.');
  if (listing.campusId !== req.user.campusId) throw new AppError(403, 'This item is on a different campus.', 'FORBIDDEN');
  if (listing.status !== 'available') throw conflict('This item is no longer available.', 'LISTING_UNAVAILABLE');

  const active = await Offer.findOne({ listing: listing._id, buyer: req.user._id, status: { $in: ['open', 'accepted'] } });
  if (active) throw conflict('You already have an active offer on this item.', 'OFFER_EXISTS');

  let offer;
  try {
    offer = await Offer.create({
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.sellerId,
      listingPrice: listing.price,
      currentAmount: amount,
      turn: 'seller',
      message,
      history: [historyEntry('offer', 'buyer', req.user, { amount, message })],
    });
  } catch (err) {
    if (err && err.code === 11000) throw conflict('You already have an active offer on this item.', 'OFFER_EXISTS');
    throw err;
  }

  notifyOther(
    offer,
    'seller',
    `New offer on "${listing.title}"`,
    `${req.user.name} offered ${amount} for "${listing.title}" (asking ${listing.price}).${message ? `\n\nMessage: ${message}` : ''}`
  );
  await respondWith(res, offer._id, req.user, { message: 'Offer sent to the seller.' }, 201);
};

// GET /api/offers   -> { received, sent, awaitingMe }
exports.getMyOffers = async (req, res) => {
  const uid = req.user._id;
  const [received, sent] = await Promise.all([
    populateOffer(Offer.find({ seller: uid }).sort({ updatedAt: -1 }).limit(200)),
    populateOffer(Offer.find({ buyer: uid }).sort({ updatedAt: -1 }).limit(200)),
  ]);
  const sr = received.map((o) => serializeOffer(o, uid));
  const ss = sent.map((o) => serializeOffer(o, uid));
  res.json({
    success: true,
    received: sr,
    sent: ss,
    awaitingMe: [...sr, ...ss].filter((o) => o.awaitingMe).length,
  });
};

// GET /api/offers/:id
exports.getOffer = async (req, res) => {
  const offer = await loadMyOffer(req);
  await respondWith(res, offer._id, req.user);
};

// POST /api/offers/:id/respond   body: { action: 'accept' | 'reject' | 'counter', amount?, message? }
exports.respond = async (req, res) => {
  const { action } = req.body;
  const offer = await loadMyOffer(req);
  const role = roleOf(offer, req.user);
  const other = role === 'buyer' ? 'seller' : 'buyer';
  const message = cleanMessage(req.body.message);

  if (offer.status !== 'open') throw conflict('This offer is already closed.');
  if (offer.turn !== role) throw conflict("It's the other student's turn to respond.");

  // Every change is guarded by the state we just read, so two simultaneous requests can't both win.
  const guard = { _id: offer._id, status: 'open', turn: role, currentAmount: offer.currentAmount };
  let updated;
  let mailSubject;
  let mailBody;

  if (action === 'reject') {
    updated = await Offer.findOneAndUpdate(
      guard,
      { $set: { status: 'rejected' }, $push: { history: historyEntry('reject', role, req.user, { message }) } },
      { new: true }
    );
    mailSubject = 'Your offer was declined';
    mailBody = `${req.user.name} declined the offer on this item.`;
  } else if (action === 'counter') {
    const amount = readAmount(req.body.amount);
    if (amount === offer.currentAmount) throw bad('Please counter with a different amount.');
    updated = await Offer.findOneAndUpdate(
      { ...guard, rounds: { $lt: MAX_ROUNDS } },
      {
        $set: { currentAmount: amount, turn: other },
        $inc: { rounds: 1 },
        $push: { history: historyEntry('counter', role, req.user, { amount, message }) },
      },
      { new: true }
    );
    if (!updated) throw conflict(`This negotiation reached its limit of ${MAX_ROUNDS} rounds. Accept or decline instead.`);
    mailSubject = 'You received a counter-offer';
    mailBody = `${req.user.name} proposed ${amount}.${message ? `\n\nMessage: ${message}` : ''}`;
  } else if (action === 'accept') {
    // 1) atomically reserve the listing so only one offer can ever win it
    const reserved = await Listing.findOneAndUpdate(
      { _id: offer.listing, status: 'available' },
      { $set: { status: 'reserved', reservedFor: offer.buyer, agreedPrice: offer.currentAmount } }
    );
    if (!reserved) {
      await Offer.updateOne(
        { _id: offer._id, status: 'open' },
        { $set: { status: 'cancelled' }, $push: { history: historyEntry('auto_cancelled', 'system', null, { message: 'The item is no longer available.' }) } }
      );
      throw conflict('This item is no longer available.', 'LISTING_UNAVAILABLE');
    }
    // 2) close this offer as accepted
    updated = await Offer.findOneAndUpdate(
      guard,
      {
        $set: { status: 'accepted', finalAmount: offer.currentAmount },
        $push: { history: historyEntry('accept', role, req.user, { amount: offer.currentAmount, message }) },
      },
      { new: true }
    );
    if (!updated) {
      await Listing.updateOne(
        { _id: offer.listing, status: 'reserved', reservedFor: offer.buyer },
        { $set: { status: 'available' }, $unset: { reservedFor: '', agreedPrice: '' } }
      );
      throw conflict('This offer changed while you were answering. Please refresh.');
    }
    // 3) everyone else who was still negotiating is told no
    await Offer.updateMany(
      { listing: offer.listing, _id: { $ne: offer._id }, status: 'open' },
      {
        $set: { status: 'rejected' },
        $push: { history: historyEntry('auto_rejected', 'system', null, { message: 'The item was reserved for another student.' }) },
      }
    );
    mailSubject = 'Deal agreed!';
    mailBody = `${req.user.name} accepted ${offer.currentAmount}. The item is now reserved - arrange a safe on-campus meetup.`;
  } else {
    throw bad('Action must be accept, reject or counter.');
  }

  if (!updated) throw conflict('This offer changed while you were answering. Please refresh.');
  notifyOther(updated, other, mailSubject, mailBody);
  await respondWith(res, offer._id, req.user);
};

// POST /api/offers/:id/withdraw   (buyer, while still negotiating)
exports.withdraw = async (req, res) => {
  const offer = await loadMyOffer(req);
  if (!offer.buyer.equals(req.user._id)) throw new AppError(403, 'Only the buyer can withdraw an offer.', 'FORBIDDEN');

  const updated = await Offer.findOneAndUpdate(
    { _id: offer._id, status: 'open' },
    { $set: { status: 'withdrawn' }, $push: { history: historyEntry('withdraw', 'buyer', req.user) } },
    { new: true }
  );
  if (!updated) throw conflict('This offer can no longer be withdrawn.');
  notifyOther(updated, 'seller', 'An offer was withdrawn', `${req.user.name} withdrew their offer.`);
  await respondWith(res, offer._id, req.user);
};

// POST /api/offers/:id/cancel   (either party, after a deal was agreed but before hand-off)
exports.cancelDeal = async (req, res) => {
  const offer = await loadMyOffer(req);
  const role = roleOf(offer, req.user);

  const updated = await Offer.findOneAndUpdate(
    { _id: offer._id, status: 'accepted' },
    {
      $set: { status: 'cancelled' },
      $push: { history: historyEntry('cancel', role, req.user, { message: cleanMessage(req.body.message) }) },
    },
    { new: true }
  );
  if (!updated) throw conflict('Only an agreed deal can be cancelled.');

  await Listing.updateOne(
    { _id: offer.listing, status: 'reserved', reservedFor: offer.buyer },
    { $set: { status: 'available' }, $unset: { reservedFor: '', agreedPrice: '' } }
  );
  notifyOther(updated, role === 'buyer' ? 'seller' : 'buyer', 'A deal was cancelled', `${req.user.name} cancelled the agreed deal. The item is available again.`);
  await respondWith(res, offer._id, req.user);
};

// POST /api/offers/:id/complete   (seller, after the hand-off)
exports.complete = async (req, res) => {
  const offer = await loadMyOffer(req);
  if (!offer.seller.equals(req.user._id)) throw new AppError(403, 'Only the seller can complete a deal.', 'FORBIDDEN');

  const updated = await Offer.findOneAndUpdate(
    { _id: offer._id, status: 'accepted' },
    { $set: { status: 'completed' }, $push: { history: historyEntry('complete', 'seller', req.user) } },
    { new: true }
  );
  if (!updated) throw conflict('Only an agreed deal can be completed.');

  await Listing.updateOne({ _id: offer.listing }, { $set: { status: 'sold', soldAt: new Date() } });
  await respondWith(res, offer._id, req.user);
};
