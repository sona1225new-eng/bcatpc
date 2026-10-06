const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
  sendForbidden,
} = require('../utils/apiResponse');
const Admin = require('../models/Admin');

/** GET /api/admins — List all admins (Superadmin only) */
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  return sendSuccess(res, admins, `${admins.length} admins retrieved.`);
});

/** GET /api/admins/:id — Get a single admin by ID (Superadmin only) */
const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id).select('-password');
  if (!admin) {
    return sendNotFound(res, `Admin with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, admin, 'Admin retrieved.');
});

/** POST /api/admins — Create a new admin (Superadmin only) */
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, isActive } = req.body;

  if (!name || !email || !password) {
    return sendBadRequest(res, 'Name, email, and password are required.');
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return sendBadRequest(res, 'An admin with this email already exists.');
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: role || 'admin',
    isActive: isActive !== undefined ? isActive : true,
  });

  const created = await Admin.findById(admin._id).select('-password');
  return sendCreated(res, created, 'Admin created successfully.');
});

/** PUT /api/admins/:id — Update admin details/role/status (Superadmin only) */
const updateAdmin = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, password } = req.body;

  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return sendNotFound(res, `Admin with id '${req.params.id}' not found.`);
  }

  if (email && email !== admin.email) {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return sendBadRequest(res, 'An admin with this email already exists.');
    }
    admin.email = email;
  }

  if (name) admin.name = name;
  if (role) admin.role = role;
  if (isActive !== undefined) admin.isActive = isActive;
  if (password) admin.password = password; // triggers pre('save') hash

  await admin.save();

  const updated = await Admin.findById(admin._id).select('-password');
  return sendSuccess(res, updated, 'Admin updated successfully.');
});

/** DELETE /api/admins/:id — Delete an admin (Superadmin only) */
const deleteAdmin = asyncHandler(async (req, res) => {
  if (req.admin && req.admin._id.toString() === req.params.id) {
    return sendForbidden(res, 'You cannot delete your own admin account.');
  }

  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) {
    return sendNotFound(res, `Admin with id '${req.params.id}' not found.`);
  }

  return sendSuccess(res, null, 'Admin deleted successfully.');
});

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
