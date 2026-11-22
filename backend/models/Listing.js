const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    origPrice: { type: Number },
    discount: { type: String, default: '' },
    courseCode: { type: String, default: 'General Campus' },
    category: { type: String, default: 'Textbooks & Courseware' },
    cat: { type: String, default: 'textbooks' },
    condition: { type: String, default: 'Good' },
    conditionBadge: { type: String, default: '' },
    badge: { type: String, default: 'STUDENT DROP' },
    badgeType: { type: String, default: 'royal' },
    badgeCls: { type: String, default: 'badge-course' },
    meetupLocation: { type: String, default: 'Moffitt Library North Steps' },
    loc: { type: String, default: 'Moffitt Library North Steps' },
    image: { type: String, default: '' },
    imgKey: { type: String, default: '' },
    grad: { type: String, default: 'linear-gradient(135deg,#c8a97e,#8b6340)' },
    desc: { type: String, default: '' },
    seller: {
      name: { type: String, default: 'Alex Morgan' },
      role: { type: String, default: 'Jr • Haas School of Business' },
      avatar: { type: String, default: '' },
      rating: { type: Number, default: 5.0 },
      verified: { type: Boolean, default: true },
      cls: { type: String, default: 'Jr' },
      hub: { type: String, default: 'Main Campus' },
      initials: { type: String, default: 'AM' },
      avCls: { type: String, default: 'avatar-ml' }
    },
    tags: [{ type: String }],
    isWishlisted: { type: Boolean, default: false },
    campusId: { type: String, default: 'berkeley' },
    fastResponder: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
    likesCount: { type: Number, default: 0 }
  },
  {
    strict: false,
    timestamps: true
  }
);

// Helper to ensure 'id' field is always populated
listingSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this._id ? this._id.toString() : `item-${Date.now()}`;
  }
  if (!this.meetupLocation && this.loc) this.meetupLocation = this.loc;
  if (!this.loc && this.meetupLocation) this.loc = this.meetupLocation;
  if (!this.category && this.cat) this.category = this.cat;
  if (!this.cat && this.category) this.cat = this.category.toLowerCase().split(' ')[0];
  if (!this.originalPrice && this.origPrice) this.originalPrice = this.origPrice;
  if (!this.origPrice && this.originalPrice) this.origPrice = this.originalPrice;
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
