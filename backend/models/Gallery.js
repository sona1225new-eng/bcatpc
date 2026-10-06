const mongoose = require('mongoose');

/**
 * Gallery model — maps to 'galleries' collection.
 * Stores department and campus photo entries.
 */
const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Campus', 'Department', 'Labs', 'Events', 'Students', 'Activities', 'General'],
      default: 'General',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, isPublished: 1 });
gallerySchema.index({ date: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
