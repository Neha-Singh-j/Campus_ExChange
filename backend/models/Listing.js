const mongoose = require('mongoose');

const CATEGORIES = [
  'Textbooks & Courseware',
  'Dorm & Furniture',
  'Electronics & Calculators',
  'Campus Gear & Merch',
  'Lab Equipment',
  'Subleases & Housing',
];
const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair (Usable)'];
const STATUSES = ['available', 'reserved', 'sold'];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    storage: { type: String, enum: ['cloudinary', 'local', 'external'], required: true },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    desc: { type: String, trim: true, maxlength: 2000, default: '' },
    price: { type: Number, required: true, min: 0, max: 1000000 },
    originalPrice: { type: Number, min: 0, max: 10000000 },
    category: { type: String, enum: CATEGORIES, required: true },
    courseCode: { type: String, trim: true, maxlength: 40, default: '' },
    condition: { type: String, enum: CONDITIONS, default: 'Good' },
    conditionBadge: { type: String, trim: true, maxlength: 120, default: '' },
    meetupLocation: { type: String, trim: true, maxlength: 120, required: true },
    tags: [{ type: String, trim: true, maxlength: 30 }],
    images: { type: [imageSchema], default: [] },

    campusId: { type: String, required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    status: { type: String, enum: STATUSES, default: 'available', index: true },
    reservedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agreedPrice: { type: Number },
    soldAt: { type: Date },
  },
  { timestamps: true }
);

listingSchema.index({ campusId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.CONDITIONS = CONDITIONS;
module.exports.STATUSES = STATUSES;
