const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    retailPrice: { type: Number, required: true },
    savings: { type: Number, required: true },
    items: [{ type: String, trim: true }],
    note: { type: String, default: '' },
    seller: {
      name: { type: String, default: 'Senior Student' },
      major: { type: String, default: "Cal '25" },
      initials: { type: String, default: 'SR' },
      avCls: { type: String, default: 'avatar-dk' },
      isSenior: { type: Boolean, default: true }
    },
    cat: {
      type: String,
      enum: ['dorm', 'eecs', 'kitchen', 'furniture', 'mcat', 'studio', 'all'],
      default: 'dorm'
    },
    zone: { type: String, default: 'Unit 2 Towle Hall Loading Zone' },
    includesDolly: { type: Boolean, default: true },
    grad: { type: String, default: 'linear-gradient(135deg,#8a9db8,#5a7290)' },
    claimed: { type: Boolean, default: false },
    sellerId: { type: String, default: null },
    claimedBy: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bundle', bundleSchema);
