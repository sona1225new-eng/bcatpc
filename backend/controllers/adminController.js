const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
  sendForbidden,
} = require('../utils/apiResponse');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const { getEffectivePermissions } = require('../utils/permissions');
const { recordAuditLog } = require('../utils/auditLogger');

/**
 * GET /api/admins — List all admins (Searchable, filterable, paginated)
 */
const getAllAdmins = asyncHandler(async (req, res) => {
  const { search, role, status, page = 1, limit = 20 } = req.query;

  const query = {};

  if (search) {
    const cleanSearch = String(search).trim();
    query.$or = [
      { name: { $regex: cleanSearch, $options: 'i' } },
      { email: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  if (role && ['superadmin', 'admin', 'editor', 'viewer'].includes(role)) {
    query.role = role;
  }

  if (status !== undefined && status !== '') {
    if (status === 'active' || status === 'true') query.isActive = true;
    if (status === 'inactive' || status === 'false') query.isActive = false;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [admins, total] = await Promise.all([
    Admin.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Admin.countDocuments(query),
  ]);

  const adminsWithPerms = admins.map((admin) => ({
    ...admin,
    effectivePermissions: getEffectivePermissions(admin),
  }));

  return sendSuccess(
    res,
    {
      admins: adminsWithPerms,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
    `${total} admin accounts found.`
  );
});

/**
 * GET /api/admins/:id — Get a single admin by ID
 */
const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id).select('-password');
  if (!admin) {
    return sendNotFound(res, `Admin with id '${req.params.id}' not found.`);
  }

  const effectivePermissions = getEffectivePermissions(admin);
  return sendSuccess(
    res,
    {
      ...admin.toObject(),
      effectivePermissions,
    },
    'Admin retrieved.'
  );
});

/**
 * POST /api/admins — Create a new admin
 */
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'admin', permissions = {}, isActive = true } = req.body;

  if (!name || !email || !password) {
    return sendBadRequest(res, 'Name, email, and password are required.');
  }

  if (password.length < 8) {
    return sendBadRequest(res, 'Password must be at least 8 characters long.');
  }

  const validRoles = ['superadmin', 'admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return sendBadRequest(res, `Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  // Non-superadmin cannot create superadmin accounts
  if (role === 'superadmin' && req.admin.role !== 'superadmin') {
    return sendForbidden(res, 'Only a Superadmin can create accounts with the Superadmin role.');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    return sendBadRequest(res, 'An administrator account with this email address already exists.');
  }

  const newAdmin = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
    permissions: typeof permissions === 'object' && permissions !== null ? permissions : {},
    isActive: Boolean(isActive),
  });

  await recordAuditLog(req, {
    action: 'CREATE_USER',
    module: 'users',
    targetId: newAdmin._id,
    targetTitle: newAdmin.email,
    details: { name: newAdmin.name, role: newAdmin.role, isActive: newAdmin.isActive },
  });

  const created = await Admin.findById(newAdmin._id).select('-password');
  return sendCreated(
    res,
    {
      ...created.toObject(),
      effectivePermissions: getEffectivePermissions(created),
    },
    'Admin account created successfully.'
  );
});

/**
 * PUT /api/admins/:id — Update admin details/role/status/password
 */
const updateAdmin = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, permissions, password } = req.body;

  const targetAdmin = await Admin.findById(req.params.id);
  if (!targetAdmin) {
    return sendNotFound(res, `Admin with id '${req.params.id}' not found.`);
  }

  const isSelf = req.admin._id.toString() === targetAdmin._id.toString();

  // Self-action safeguards
  if (isSelf && role !== undefined && role !== targetAdmin.role) {
    return sendForbidden(res, 'You cannot modify your own role.');
  }

  if (isSelf && isActive !== undefined && isActive === false) {
    return sendForbidden(res, 'You cannot deactivate your own account.');
  }

  // Only superadmins can assign or revoke superadmin role
  if (role && role === 'superadmin' && req.admin.role !== 'superadmin') {
    return sendForbidden(res, 'Only a Superadmin can assign the Superadmin role.');
  }

  // Last active Superadmin protection
  const isDemotingSuperadmin = targetAdmin.role === 'superadmin' && role && role !== 'superadmin';
  const isDeactivatingSuperadmin = targetAdmin.role === 'superadmin' && isActive === false;

  if (isDemotingSuperadmin || isDeactivatingSuperadmin) {
    const activeSuperadmins = await Admin.countDocuments({
      role: 'superadmin',
      isActive: true,
    });
    if (activeSuperadmins <= 1) {
      return sendBadRequest(
        res,
        'Operation denied: Cannot demote or deactivate the last active Superadmin.'
      );
    }
  }

  // Email update uniqueness check
  if (email && email.toLowerCase().trim() !== targetAdmin.email) {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing && existing._id.toString() !== targetAdmin._id.toString()) {
      return sendBadRequest(res, 'An account with this email address already exists.');
    }
    targetAdmin.email = normalizedEmail;
  }

  if (name) targetAdmin.name = name.trim();
  if (role) targetAdmin.role = role;
  if (isActive !== undefined) targetAdmin.isActive = Boolean(isActive);
  if (permissions !== undefined && typeof permissions === 'object') {
    targetAdmin.permissions = permissions;
  }

  // Authorized password reset workflow
  if (password) {
    if (password.length < 8) {
      return sendBadRequest(res, 'New password must be at least 8 characters long.');
    }
    targetAdmin.password = password; // Triggers pre('save') hash hook
  }

  await targetAdmin.save();

  await recordAuditLog(req, {
    action: 'UPDATE_USER',
    module: 'users',
    targetId: targetAdmin._id,
    targetTitle: targetAdmin.email,
    details: {
      name: targetAdmin.name,
      role: targetAdmin.role,
      isActive: targetAdmin.isActive,
      passwordReset: Boolean(password),
    },
  });

  const updated = await Admin.findById(targetAdmin._id).select('-password');
  return sendSuccess(
    res,
    {
      ...updated.toObject(),
      effectivePermissions: getEffectivePermissions(updated),
    },
    'Admin account updated successfully.'
  );
});

/**
 * DELETE /api/admins/:id — Delete an admin account
 */
const deleteAdmin = asyncHandler(async (req, res) => {
  const targetAdmin = await Admin.findById(req.params.id);
  if (!targetAdmin) {
    return sendNotFound(res, `Admin with id '${req.params.id}' not found.`);
  }

  // Prevent deleting oneself
  if (req.admin && req.admin._id.toString() === targetAdmin._id.toString()) {
    return sendForbidden(res, 'You cannot delete your own admin account.');
  }

  // Protect last active superadmin
  if (targetAdmin.role === 'superadmin') {
    const activeSuperadmins = await Admin.countDocuments({
      role: 'superadmin',
      isActive: true,
    });
    if (activeSuperadmins <= 1) {
      return sendBadRequest(
        res,
        'Operation denied: Cannot delete the last active Superadmin account.'
      );
    }
  }

  await Admin.findByIdAndDelete(targetAdmin._id);

  await recordAuditLog(req, {
    action: 'DELETE_USER',
    module: 'users',
    targetId: targetAdmin._id,
    targetTitle: targetAdmin.email,
    details: { name: targetAdmin.name, role: targetAdmin.role },
  });

  return sendSuccess(res, null, `Admin account '${targetAdmin.email}' deleted successfully.`);
});

/**
 * GET /api/admins/audit-logs — Retrieve system audit logs
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const { module: mod, action, search, page = 1, limit = 50 } = req.query;

  const query = {};
  if (mod) query.module = mod;
  if (action) query.action = action;
  if (search) {
    query.$or = [
      { adminName: { $regex: search, $options: 'i' } },
      { adminEmail: { $regex: search, $options: 'i' } },
      { targetTitle: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return sendSuccess(
    res,
    {
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
    `${total} audit log entries retrieved.`
  );
});

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAuditLogs,
};
