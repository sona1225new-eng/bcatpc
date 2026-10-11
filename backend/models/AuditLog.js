const mongoose = require('mongoose');

/**
 * AuditLog model — tracks important administrative activities for accountability.
 * Passwords, tokens, and sensitive secrets are never logged.
 */
const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    adminName: {
      type: String,
      required: true,
      trim: true,
    },
    adminEmail: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String, // e.g. 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'PAGE_CREATE', etc.
      required: true,
      trim: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: String,
      default: null,
    },
    targetTitle: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1 });
auditLogSchema.index({ adminId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
