const AuditLog = require('../models/AuditLog');

/**
 * Records an entry into the audit trail.
 * Strictly sanitizes sensitive information: never records passwords, tokens, or hashes.
 */
const recordAuditLog = async (req, { action, module, targetId = null, targetTitle = '', details = {} }) => {
  try {
    if (!req.admin) return;

    // Sanitize details: strip any password, token, or auth related keys
    const safeDetails = { ...details };
    const forbiddenKeys = ['password', 'token', 'newPassword', 'currentPassword', 'hash', 'secret'];
    forbiddenKeys.forEach((key) => {
      delete safeDetails[key];
    });

    const ipAddress =
      req.headers['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      req.ip ||
      '';

    await AuditLog.create({
      adminId: req.admin._id,
      adminName: req.admin.name,
      adminEmail: req.admin.email,
      action,
      module,
      targetId: targetId ? targetId.toString() : null,
      targetTitle: String(targetTitle).substring(0, 200),
      details: safeDetails,
      ipAddress: String(ipAddress),
    });
  } catch (err) {
    // Avoid failing main requests if audit log saving encounters an issue, but log error
    console.error('Audit logger warning:', err.message);
  }
};

module.exports = { recordAuditLog };
