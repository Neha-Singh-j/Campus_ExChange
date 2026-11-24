const mongoose = require('mongoose');

// One row per purchase. This is what the admin dashboard reads to show
// what was bought/sold and at what rate.
const orderSchema = new mongoose.Schema(
  {
    itemType: { type: String, enum: ['listing', 'bundle'], required: true },
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    originalPrice: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0 },
    discountPct: { type: Number, default: 0 },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    sellerId: { type: String, default: null, index: true },
    sellerName: { type: String, default: 'Campus Seller' },
    meetupLocation: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
