const mongoose = require('mongoose');

/**
 * Faculty model — maps to the 'faculties' collection.
 * Supports all four current faculty members and is designed for
 * Admin Dashboard CRUD operations.
 */
const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    designation: {
      type: String,
      default: '',
      trim: true,
    },
    shortDesignation: {
      type: String,
      default: '',
      trim: true,
    },
    qualification: {
      type: String,
      default: '',
      trim: true,
    },
    specialization: {
      type: String,
      default: '',
      trim: true,
    },
    experience: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    photo: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    teachingAreas: {
      type: [String],
      default: [],
    },
    academicInterests: {
      type: [String],
      default: [],
    },
    publications: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    officeRoom: {
      type: String,
      default: '',
      trim: true,
    },
    officeHours: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0, // Used to control display order in the frontend
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for fast name search
facultySchema.index({ name: 'text', specialization: 'text' });

module.exports = mongoose.model('Faculty', facultySchema);
