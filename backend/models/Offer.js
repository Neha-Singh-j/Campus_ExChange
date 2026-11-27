const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['offer', 'counter', 'accept', 'reject', 'withdraw', 'cancel', 'complete', 'auto_rejected', 'auto_cancelled'],
      required: true,
    },
    role: { type: String, enum: ['buyer', 'seller', 'system'], required: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    message: { type: String, maxlength: 500, default: '' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * One negotiation between a buyer and the seller of a listing.
 *   open       - being negotiated; `turn` says whose reply is awaited
 *   accepted   - price agreed, listing is reserved for the buyer
 *   completed  - hand-off done, listing is sold
 *   rejected / withdrawn / cancelled - closed without a deal
 */
const offerSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listingPrice: { type: Number, required: true },
    currentAmount: { type: Number, required: true, min: 1 },
    turn: { type: String, enum: ['buyer', 'seller'], default: 'seller' },
    status: {
      type: String,
      enum: ['open', 'accepted', 'completed', 'rejected', 'withdrawn', 'cancelled'],
      default: 'open',
      index: true,
    },
    finalAmount: { type: Number },
    message: { type: String, maxlength: 500, default: '' },
    rounds: { type: Number, default: 1 },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

// A buyer can only have ONE open negotiation per listing (enforced by the database).
offerSchema.index(
  { listing: 1, buyer: 1 },
  { unique: true, partialFilterExpression: { status: 'open' } }
);

module.exports = mongoose.model('Offer', offerSchema);
