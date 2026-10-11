/**
 * Permission utility & Role-Based Access Control (RBAC) definitions.
 *
 * Supported modules:
 * - dashboard
 * - faculty
 * - academics
 * - pyqs
 * - blogs
 * - notices
 * - campusUpdates
 * - gallery
 * - pages
 * - users
 * - settings
 *
 * Supported actions: 'view', 'create', 'edit', 'publish', 'delete'
 */

const MODULES = [
  'dashboard',
  'faculty',
  'academics',
  'pyqs',
  'blogs',
  'notices',
  'campusUpdates',
  'gallery',
  'pages',
  'users',
  'settings',
];

const ACTIONS = ['view', 'create', 'edit', 'publish', 'delete'];

// Content modules that follow standard CRUD + Publish lifecycle
const CONTENT_MODULES = [
  'faculty',
  'academics',
  'pyqs',
  'blogs',
  'notices',
  'campusUpdates',
  'gallery',
  'pages',
];

/**
 * Default permission definitions mapped by user role.
 */
const DEFAULT_PERMISSIONS_BY_ROLE = {
  superadmin: MODULES.reduce((acc, mod) => {
    acc[mod] = [...ACTIONS];
    return acc;
  }, {}),

  admin: {
    dashboard: ['view'],
    ...CONTENT_MODULES.reduce((acc, mod) => {
      acc[mod] = ['view', 'create', 'edit', 'publish', 'delete'];
      return acc;
    }, {}),
    users: [], // Non-superadmins cannot manage user accounts by default
    settings: ['view', 'edit'],
  },

  editor: {
    dashboard: ['view'],
    ...CONTENT_MODULES.reduce((acc, mod) => {
      acc[mod] = ['view', 'create', 'edit']; // Cannot publish or delete by default
      return acc;
    }, {}),
    users: [],
    settings: ['view', 'edit'],
  },

  viewer: {
    dashboard: ['view'],
    ...CONTENT_MODULES.reduce((acc, mod) => {
      acc[mod] = ['view'];
      return acc;
    }, {}),
    users: [],
    settings: ['view'],
  },
};

/**
 * Normalizes module names (handles kebab-case and camelCase)
 */
const normalizeModuleName = (mod) => {
  if (!mod) return '';
  if (mod === 'campus-updates') return 'campusUpdates';
  if (mod === 'user-management') return 'users';
  if (mod === 'dynamic-pages') return 'pages';
  return mod;
};

/**
 * Returns the effective resolved permissions for an admin.
 * If custom permissions are configured in admin.permissions, they override the defaults.
 */
const getEffectivePermissions = (admin) => {
  if (!admin) return {};
  if (admin.role === 'superadmin') {
    return DEFAULT_PERMISSIONS_BY_ROLE.superadmin;
  }

  const roleDefaults = DEFAULT_PERMISSIONS_BY_ROLE[admin.role] || DEFAULT_PERMISSIONS_BY_ROLE.viewer;
  const customPermissions = admin.permissions || {};

  const effective = {};
  MODULES.forEach((mod) => {
    if (Array.isArray(customPermissions[mod]) && customPermissions[mod].length > 0) {
      effective[mod] = customPermissions[mod];
    } else {
      effective[mod] = roleDefaults[mod] || [];
    }
  });

  return effective;
};

/**
 * Determines whether an admin has permission to execute an action on a module.
 */
const hasPermission = (admin, moduleName, action) => {
  if (!admin || !admin.isActive) return false;
  if (admin.role === 'superadmin') return true;

  const normalizedMod = normalizeModuleName(moduleName);
  const effective = getEffectivePermissions(admin);

  const modulePerms = effective[normalizedMod] || [];
  return modulePerms.includes(action);
};

module.exports = {
  MODULES,
  ACTIONS,
  CONTENT_MODULES,
  DEFAULT_PERMISSIONS_BY_ROLE,
  normalizeModuleName,
  getEffectivePermissions,
  hasPermission,
};
