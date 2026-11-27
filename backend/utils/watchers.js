const Watchlist = require('../models/Watchlist');
const { notifyQuietly } = require('./mailer');

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * After a new listing is posted, emails students whose course watchlist matches it
 * (same course code, or the course code appears in the title) and whose price ceiling covers it.
 * Fire-and-forget: never blocks or fails the request.
 */
const notifyWatchers = async (listing) => {
  try {
    const candidates = await Watchlist.find({ autoNotify: true, maxPrice: { $gte: listing.price } })
      .populate('user', 'name email campusId')
      .limit(500);

    const haystack = `${norm(listing.courseCode)}|${norm(listing.title)}`;
    for (const w of candidates) {
      if (!w.user || w.user._id.equals(listing.sellerId) || w.user.campusId !== listing.campusId) continue;
      const code = norm(w.course);
      if (!code || !haystack.includes(code)) continue;

      notifyQuietly(
        w.user.email,
        `New for ${w.course}: ${listing.title}`,
        `Hi ${w.user.name},\n\nA new item matches your ${w.course} watchlist: "${listing.title}" for ${listing.price} (your limit: ${w.maxPrice}).\n\nOpen Campus Exchange to make an offer.\n`
      );
    }
  } catch (err) {
    console.warn('[watchlists] notify failed:', err.message);
  }
};

module.exports = { notifyWatchers };
