const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  linkId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Link',
    required: true,
    index: true,
  },
  ts: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ip: { type: String },
  userAgent: { type: String }
}, { timestamps: false });

clickSchema.index({ linkId: 1, ts: -1 });

module.exports = mongoose.model('Click', clickSchema);
