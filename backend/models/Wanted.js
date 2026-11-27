const mongoose = require('mongoose');

const wantedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    campusId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
    desc: { type: String, trim: true, maxlength: 1500, default: '' },
    budget: { type: String, required: true, trim: true, maxlength: 40 },
    zone: { type: String, trim: true, maxlength: 120, default: 'Main Campus' },
    urgency: { type: String, trim: true, maxlength: 60, default: 'Flexible' },
    category: { type: String, trim: true, maxlength: 60, default: 'Textbooks & Notes' },
    status: { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
    offers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, min: 0 },
        message: { type: String, maxlength: 500, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

wantedSchema.index({ campusId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Wanted', wantedSchema);
