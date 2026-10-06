const mongoose = require('mongoose');

/**
 * Coordinator model — maps to 'coordinators' collection.
 * Typically a single document for the department coordinator.
 * Designed for Admin Dashboard editing.
 */
const coordinatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Coordinator Name',
      trim: true,
    },
    designation: {
      type: String,
      default: 'Coordinator, Department of Computer Applications',
      trim: true,
    },
    institution: {
      type: String,
      default: 'T.P. College, Madhepura',
      trim: true,
    },
    photo: {
      type: String,
      default: '',
      trim: true,
    },
    badge: {
      type: String,
      default: 'DESK OF THE COORDINATOR',
      trim: true,
    },
    title: {
      type: String,
      default: 'Message from the Coordinator',
      trim: true,
    },
    message: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coordinator', coordinatorSchema);
