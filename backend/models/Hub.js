const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema(
  {
    zone: { type: String, required: true },
    name: { type: String, required: true },
    hours: { type: String, required: true },
    status: { type: String, default: 'Open' },
    statusCls: { type: String, default: 'pill-mint' },
    cctvMonitored: { type: Boolean, default: true },
    itemsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hub', hubSchema);
