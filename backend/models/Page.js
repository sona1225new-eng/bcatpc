const mongoose = require('mongoose');

/**
 * Page model — Stores dynamic user-created content pages.
 * Fully managed through the Admin Dashboard without editing code.
 */
const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens (e.g. admission-information)',
      ],
    },
    content: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    featuredImage: {
      type: String,
      default: '',
      trim: true,
    },
    seoTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'SEO title cannot exceed 100 characters'],
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: [300, 'SEO description cannot exceed 300 characters'],
    },
    keywords: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    authorName: {
      type: String,
      default: 'Admin',
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

pageSchema.index({ status: 1, publishedAt: -1 });
pageSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Page', pageSchema);
