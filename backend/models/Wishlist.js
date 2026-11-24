const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'me' },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    seller: { type: String, default: 'Cal Student' },
    initials: { type: String, default: 'CS' },
    avCls: { type: String, default: 'avatar-cb' },
    drop: { type: String, default: 'Price Alert Active' },
    dropCls: { type: String, default: 'price-drop-green' },
    hub: { type: String, default: 'Campus Hub' },
    label: { type: String, default: 'ITEM' },
    condition: { type: String, default: 'Good' },
    desc: { type: String, default: '' },
    grad: { type: String, default: 'linear-gradient(135deg,#c8a060,#8a6030)' },
    btn1: { type: String, default: 'Buy / Hold Escrow' },
    btn1Cls: { type: String, default: 'btn-success' },
    btn2: { type: String, default: 'Message Seller' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
