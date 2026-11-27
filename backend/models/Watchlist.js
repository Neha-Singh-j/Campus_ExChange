const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: String, required: true, trim: true, maxlength: 40 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    maxPrice: { type: Number, required: true, min: 0 },
    autoNotify: { type: Boolean, default: true },
    status: { type: String, default: 'Monitoring' },
    notifications: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);
