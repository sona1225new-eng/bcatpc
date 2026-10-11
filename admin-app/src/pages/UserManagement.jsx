import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineKey,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiEye,
  HiEyeSlash,
} from 'react-icons/hi2';

const MODULE_LIST = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'academics', label: 'Academics' },
  { id: 'pyqs', label: 'PYQ / Question Bank' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'notices', label: 'Notices' },
  { id: 'campusUpdates', label: 'Campus Updates' },
  { id: 'gallery', label: 'Gallery & Albums' },
  { id: 'pages', label: 'Dynamic Pages' },
  { id: 'users', label: 'User Management' },
  { id: 'settings', label: 'Profile Settings' },
];

const ACTION_LIST = ['view', 'create', 'edit', 'publish', 'delete'];

const DEFAULT_PERMS = {
  superadmin: MODULE_LIST.reduce((acc, m) => {
    acc[m.id] = [...ACTION_LIST];
    return acc;
  }, {}),
  admin: MODULE_LIST.reduce((acc, m) => {
    if (m.id === 'users') acc[m.id] = [];
    else if (m.id === 'dashboard') acc[m.id] = ['view'];
    else if (m.id === 'settings') acc[m.id] = ['view', 'edit'];
    else acc[m.id] = ['view', 'create', 'edit', 'publish', 'delete'];
    return acc;
  }, {}),
  editor: MODULE_LIST.reduce((acc, m) => {
    if (m.id === 'users') acc[m.id] = [];
    else if (m.id === 'dashboard') acc[m.id] = ['view'];
    else if (m.id === 'settings') acc[m.id] = ['view', 'edit'];
    else acc[m.id] = ['view', 'create', 'edit'];
    return acc;
  }, {}),
  viewer: MODULE_LIST.reduce((acc, m) => {
    if (m.id === 'users') acc[m.id] = [];
    else acc[m.id] = ['view'];
    return acc;
  }, {}),
};

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'admin',
  isActive: true,
  permissions: {},
};

export default function UserManagement() {
  const { admin: currentAdmin, isSuperAdmin } = useAuth();
  const toast = useToast();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [customPermsActive, setCustomPermsActive] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');

  const fetchAdmins = async (page = pagination.page) => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: pagination.limit };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'All') params.role = roleFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await adminService.getAll(params);
      if (res.data) {
        setAdmins(res.data.admins || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load administrator accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]);

  const fetchAuditLogs = async () => {
    try {
      setAuditLoading(true);
      const params = { limit: 50 };
      if (auditSearch.trim()) params.search = auditSearch.trim();
      const res = await adminService.getAuditLogs(params);
      setAuditLogs(res.data?.logs || []);
    } catch (err) {
      toast.error(err.message || 'Failed to retrieve audit trail.');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedAdmin(null);
    setFormData({
      ...INITIAL_FORM,
      permissions: JSON.parse(JSON.stringify(DEFAULT_PERMS.admin)),
    });
    setResetPasswordMode(false);
    setCustomPermsActive(false);
    setShowPassword(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (adminItem) => {
    setSelectedAdmin(adminItem);
    const existingPerms =
      adminItem.permissions && Object.keys(adminItem.permissions).length > 0
        ? adminItem.permissions
        : adminItem.effectivePermissions || DEFAULT_PERMS[adminItem.role] || DEFAULT_PERMS.viewer;

    setFormData({
      name: adminItem.name || '',
      email: adminItem.email || '',
      password: '',
      role: adminItem.role || 'admin',
      isActive: adminItem.isActive ?? true,
      permissions: JSON.parse(JSON.stringify(existingPerms)),
    });
    setResetPasswordMode(false);
    setCustomPermsActive(
      adminItem.permissions && Object.keys(adminItem.permissions).length > 0
    );
    setShowPassword(false);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (adminItem) => {
    setSelectedAdmin(adminItem);
    setIsDeleteOpen(true);
  };

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: JSON.parse(JSON.stringify(DEFAULT_PERMS[newRole] || DEFAULT_PERMS.viewer)),
    }));
  };

  const togglePermission = (moduleId, action) => {
    setFormData((prev) => {
      const currentList = prev.permissions[moduleId] || [];
      const updatedList = currentList.includes(action)
        ? currentList.filter((a) => a !== action)
        : [...currentList, action];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: updatedList,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required.');
      return;
    }

    if (!selectedAdmin && (!formData.password || formData.password.length < 8)) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (resetPasswordMode && formData.password && formData.password.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        isActive: formData.isActive,
        permissions: customPermsActive ? formData.permissions : {},
      };

      if (!selectedAdmin) {
        payload.password = formData.password;
        await adminService.create(payload);
        toast.success(`Administrator account created for "${payload.email}".`);
      } else {
        if (resetPasswordMode && formData.password) {
          payload.password = formData.password;
        }
        await adminService.update(selectedAdmin._id, payload);
        toast.success(`Account "${payload.email}" updated successfully.`);
      }

      setIsFormOpen(false);
      fetchAdmins(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    try {
      setDeleting(true);
      await adminService.delete(selectedAdmin._id);
      toast.success(`Administrator account "${selectedAdmin.email}" deleted.`);
      setIsDeleteOpen(false);
      fetchAdmins(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'superadmin':
        return 'draft'; // gold style
      case 'admin':
        return 'blue';
      case 'editor':
        return 'purple';
      case 'viewer':
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <HiOutlineShieldCheck className="text-gold-400 text-2xl" />
            <span>User Management & Access Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage administrative personnel, configure role permissions, and review the audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setIsAuditOpen(true);
              fetchAuditLogs();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold transition-all active:scale-95 shrink-0"
          >
            <HiOutlineClipboardDocumentList className="text-base text-gold-400" />
            <span>Audit Trail</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-navy-900/30 transition-all active:scale-95 shrink-0"
          >
            <HiPlus className="text-base" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      <ErrorAlert message={error} onRetry={() => fetchAdmins(1)} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search administrators by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Roles</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      {loading ? (
        <LoadingSpinner message="Loading administrator accounts..." />
      ) : admins.length === 0 ? (
        <EmptyState
          title="No administrators found"
          description="Create accounts with customized roles and permissions to delegate departmental tasks."
          actionText="+ Add Administrator"
          onAction={handleOpenAdd}
          icon={HiOutlineUserGroup}
        />
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {admins.map((item) => {
                  const isCurrent = currentAdmin?._id === item._id;
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 to-navy-700 border border-slate-700/60 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            {item.name?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white truncate">
                                {item.name}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[11px] font-mono truncate block">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={getRoleBadgeVariant(item.role)} size="xs">
                          {item.role}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={item.isActive ? 'active' : 'inactive'} size="xs">
                          {item.isActive ? 'Active' : 'Deactivated'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {item.lastActivity || item.lastLogin ? (
                          <span className="text-[11px]">
                            {new Date(item.lastActivity || item.lastLogin).toLocaleDateString()}{' '}
                            <span className="text-slate-400">
                              {new Date(item.lastActivity || item.lastLogin).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Never logged in</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit User & Permissions"
                          >
                            <HiOutlinePencilSquare className="text-base" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            disabled={isCurrent}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:cursor-not-allowed"
                            title={
                              isCurrent
                                ? 'You cannot delete your own account'
                                : 'Delete Administrator'
                            }
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="p-4 border-t border-slate-800">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => fetchAdmins(page)}
              />
            </div>
          )}
        </div>
      )}

      {/* Create / Edit User Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedAdmin ? `Edit User: ${selectedAdmin.email}` : 'Create New Administrator'}
        subtitle="Configure profile credentials, security role, and custom module permissions."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rajesh@tpcollege.ac.in"
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Administrative Role <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                disabled={selectedAdmin?._id === currentAdmin?._id}
                className="w-full px-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-gold-500 cursor-pointer disabled:opacity-50"
              >
                {isSuperAdmin && <option value="superadmin">Superadmin (Full Authority)</option>}
                <option value="admin">Admin (Standard Modules)</option>
                <option value="editor">Editor (Create & Edit Content)</option>
                <option value="viewer">Viewer (Read Only)</option>
              </select>
              {selectedAdmin?._id === currentAdmin?._id && (
                <p className="text-[10px] text-amber-400">
                  You cannot alter your own administrative role.
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Account Status</label>
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    disabled={selectedAdmin?._id === currentAdmin?._id}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50"></div>
                </label>
                <span className="text-xs font-medium text-slate-300">
                  {formData.isActive ? 'Active Account' : 'Deactivated'}
                </span>
              </div>
            </div>
          </div>

          {/* Password section */}
          {!selectedAdmin ? (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Initial Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 pr-10 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <HiEyeSlash /> : <HiEye />}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <HiOutlineKey className="text-gold-400 text-sm" />
                  <span>Reset Password</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordMode(!resetPasswordMode);
                    setFormData({ ...formData, password: '' });
                  }}
                  className="text-[11px] text-gold-400 hover:underline font-semibold"
                >
                  {resetPasswordMode ? 'Cancel Reset' : 'Change Password'}
                </button>
              </div>

              {resetPasswordMode && (
                <div className="pt-2 space-y-1">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter new secure password (min 8 characters)"
                      className="w-full px-3 py-2 pr-10 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <HiEyeSlash /> : <HiEye />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Existing password is never revealed. Securely updates with salted bcrypt hash.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Custom Permissions Matrix */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Module Permissions
                </h4>
                <p className="text-[11px] text-slate-400">
                  Granular action rights for this administrative user.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomPermsActive(!customPermsActive);
                    if (!customPermsActive) {
                      setFormData((prev) => ({
                        ...prev,
                        permissions: JSON.parse(
                          JSON.stringify(DEFAULT_PERMS[prev.role] || DEFAULT_PERMS.viewer)
                        ),
                      }));
                    }
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                    customPermsActive
                      ? 'bg-gold-500/10 text-gold-400 border-gold-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {customPermsActive ? 'Custom Permissions Active' : 'Use Role Defaults'}
                </button>
              </div>
            </div>

            {customPermsActive && (
              <div className="max-h-56 overflow-y-auto border border-slate-800/80 rounded-xl divide-y divide-slate-800/60 bg-slate-950/30 p-1">
                {MODULE_LIST.map((mod) => {
                  const currentModPerms = formData.permissions[mod.id] || [];
                  return (
                    <div
                      key={mod.id}
                      className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/40 rounded-lg"
                    >
                      <span className="text-xs font-semibold text-slate-200">
                        {mod.label}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {ACTION_LIST.map((action) => {
                          const isChecked = currentModPerms.includes(action);
                          return (
                            <label
                              key={action}
                              className="inline-flex items-center gap-1 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(mod.id, action)}
                                className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-gold-500"
                              />
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {action}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-all shadow-lg shadow-navy-900/40 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : selectedAdmin ? (
                'Save Changes'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Audit Log Modal */}
      <Modal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        title="Administrative Audit Trail"
        subtitle="Chronological record of sensitive actions, user management, and publications."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAuditLogs()}
                placeholder="Search audit trail by admin, action, or target..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>
            <button
              type="button"
              onClick={fetchAuditLogs}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
            >
              Search
            </button>
          </div>

          {auditLoading ? (
            <LoadingSpinner message="Loading audit logs..." />
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit trail events recorded matching this filter.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800/80 bg-slate-950/40">
              {auditLogs.map((log) => (
                <div key={log._id} className="p-3 text-xs space-y-1 hover:bg-slate-900/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-white truncate">
                        {log.adminName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono truncate">
                        ({log.adminEmail})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-navy-900/60 text-gold-400 border border-navy-700">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Module: <strong className="text-white">{log.module}</strong>
                    </span>
                    {log.targetTitle && (
                      <span className="text-[11px] text-slate-400 truncate">
                        Target: <span className="text-slate-200 font-semibold">{log.targetTitle}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsAuditOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Close Audit Trail
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Administrator Account"
        message={`Are you sure you want to permanently delete administrator account "${selectedAdmin?.email}"? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        isDeleting={deleting}
      />
    </div>
  );
}
