const mongoose = require('mongoose');

const wantedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: '' },
    budget: { type: String, required: true },
    border: { type: String, default: '#0f1fa8' },
    initials: { type: String, default: 'UC' },
    avCls: { type: String, default: 'avatar-st' },
    name: { type: String, required: true },
    course: { type: String, default: 'Student • So' },
    timeAgo: { type: String, default: 'Just now' },
    tags: [
      {
        t: { type: String },
        cls: { type: String, default: 'chip-blue' }
      }
    ],
    zone: { type: String, default: 'Main Campus' },
    activity: { type: String, default: 'Be the first to reply' },
    actColor: { type: String, default: 'var(--muted)' },
    urgency: {
      type: String,
      enum: ['urgent', 'this_week', 'flexible'],
      default: 'urgent'
    },
    category: {
      type: String,
      enum: ['course', 'dorm', 'electronics', 'moving', 'gear', 'study_rides'],
      default: 'course'
    },
    userId: { type: String, default: null },
    offers: [
      {
        offeredById: { type: String, default: null },
        offeredBy: { type: String, default: 'Anonymous Cal Student' },
        amount: { type: Number },
        message: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wanted', wantedSchema);
