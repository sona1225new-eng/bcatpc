const mongoose = require('mongoose');

/**
 * Notice model — maps to 'notices' collection.
 * Supports Official, Examination, Campus Life, and Department categories.
 */
const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Official', 'Admission', 'Examination', 'Campus Life', 'Department', 'General'],
      required: [true, 'Category is required'],
    },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    referenceNo: {
      type: String,
      default: '',
      trim: true,
    },
    author: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
      trim: true,
    },
    documentName: {
      type: String,
      default: '',
      trim: true,
    },
    documentSize: {
      type: String,
      default: '',
      trim: true,
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
  },
  { timestamps: true }
);

noticeSchema.index({ title: 'text', description: 'text' });
noticeSchema.index({ category: 1, status: 1 });
noticeSchema.index({ date: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
