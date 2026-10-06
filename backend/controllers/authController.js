const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendBadRequest, sendUnauthorized } = require('../utils/apiResponse');
const Admin = require('../models/Admin');

/** Generate a signed JWT for an admin */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * POST /api/auth/login
 * Public — authenticate admin and return JWT.
 */
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendBadRequest(res, 'Email and password are required.');
  }

  // Explicitly select password (it's excluded by default)
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.comparePassword(password))) {
    return sendUnauthorized(res, 'Invalid email or password.');
  }

  if (!admin.isActive) {
    return sendUnauthorized(res, 'This account has been deactivated.');
  }

  // Update last login timestamp
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = generateToken(admin._id);

  // Send httpOnly cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie('token', token, cookieOptions);

  return sendSuccess(res, {
    token,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
    },
  }, 'Login successful.');
});

/**
 * POST /api/auth/logout
 * Protected/Public — clears authentication cookie.
 */
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return sendSuccess(res, null, 'Logged out successfully.');
});

/**
 * GET /api/auth/me
 * Protected — return the authenticated admin's profile.
 */
const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, req.admin, 'Admin profile retrieved.');
});

/**
 * PUT /api/auth/change-password
 * Protected — update current admin's password.
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendBadRequest(res, 'Current password and new password are required.');
  }

  if (newPassword.length < 8) {
    return sendBadRequest(res, 'New password must be at least 8 characters long.');
  }

  const admin = await Admin.findById(req.admin._id).select('+password');
  if (!admin || !(await admin.comparePassword(currentPassword))) {
    return sendBadRequest(res, 'Current password is incorrect.');
  }

  admin.password = newPassword;
  await admin.save();

  return sendSuccess(res, null, 'Password updated successfully.');
});

/**
 * POST /api/auth/register
 * Protected (superadmin only) — create a new admin account.
 * Keep route protected in production; useful for initial setup only.
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return sendBadRequest(res, 'Name, email, and password are required.');
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return sendBadRequest(res, 'An admin with this email already exists.');
  }

  const admin = await Admin.create({ name, email, password, role });
  const token = generateToken(admin._id);

  return sendCreated(res, {
    token,
    admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  }, 'Admin account created.');
});

module.exports = { loginAdmin, logoutAdmin, getMe, changePassword, registerAdmin };
