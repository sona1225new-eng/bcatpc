const mongoose = require('mongoose');

/**
 * CampusUpdate model — maps to 'campusupdates' collection.
 * Stores department achievements, lab upgrades, workshops, and placement news.
 */
const campusUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campus update title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Achievement', 'Infrastructure', 'Workshop', 'Placement', 'General', 'Event'],
      default: 'General',
    },
    author: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    readTime: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

campusUpdateSchema.index({ title: 'text', shortDescription: 'text' });
campusUpdateSchema.index({ category: 1, status: 1 });
campusUpdateSchema.index({ date: -1 });

module.exports = mongoose.model('CampusUpdate', campusUpdateSchema);
