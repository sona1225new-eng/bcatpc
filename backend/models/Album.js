const mongoose = require('mongoose');

const albumImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  caption: {
    type: String,
    default: '',
    trim: true,
  },
  altText: {
    type: String,
    default: '',
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
      maxlength: [200, 'Album title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Album slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ['Campus', 'Department', 'Labs', 'Events', 'Students', 'Activities', 'General'],
      default: 'General',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [albumImageSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
);

albumSchema.index({ category: 1, isPublished: 1 });
albumSchema.index({ eventDate: -1 });
albumSchema.index({ order: 1 });

module.exports = mongoose.model('Album', albumSchema);
