const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'me' },
    course: { type: String, required: true },
    title: { type: String, required: true },
    maxPrice: { type: Number, required: true },
    autoNotify: { type: Boolean, default: true },
    status: { type: String, default: 'Monitoring' },
    notifications: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);
