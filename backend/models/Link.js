const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  longUrl: {
    type: String,
    required: true,
    trim: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

linkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Link', linkSchema);

