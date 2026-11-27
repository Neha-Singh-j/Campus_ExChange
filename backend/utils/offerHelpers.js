const Offer = require('../models/Offer');

/**
 * Closes every still-active offer on a listing. Used when the seller deletes the listing,
 * marks it sold, or puts it back on the market.
 *   open     -> cancelled
 *   accepted -> cancelled   (unless `completeAccepted`, then -> completed)
 */
const closeOffersForListing = async (listingId, { completeAccepted = false, reason = '' } = {}) => {
  const at = new Date();
  await Offer.updateMany(
    { listing: listingId, status: 'open' },
    {
      $set: { status: 'cancelled' },
      $push: { history: { action: 'auto_cancelled', role: 'system', message: reason, at } },
    }
  );
  await Offer.updateMany(
    { listing: listingId, status: 'accepted' },
    completeAccepted
      ? { $set: { status: 'completed' }, $push: { history: { action: 'complete', role: 'system', message: reason, at } } }
      : { $set: { status: 'cancelled' }, $push: { history: { action: 'auto_cancelled', role: 'system', message: reason, at } } }
  );
};

module.exports = { closeOffersForListing };
