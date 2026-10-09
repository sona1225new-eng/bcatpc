import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  HiShieldCheck,
  HiOutlineKey,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiServerStack,
} from 'react-icons/hi2';

export default function ProfileSettings() {
  const { admin, changePassword } = useAuth();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await changePassword(currentPassword, newPassword);
      toast.success('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">Account & Security Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your administrator profile, security credentials, and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-navy-900 to-navy-900 text-white font-bold text-3xl flex items-center justify-center shadow-xl shadow-navy-900/30">
            {admin?.name?.charAt(0) || 'A'}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{admin?.name || 'Administrator'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{admin?.email}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <HiShieldCheck className="text-sm" />
            <span>Role: {admin?.role || 'superadmin'}</span>
          </div>

          <div className="w-full pt-4 border-t border-slate-800/80 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Account Status:</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Last Login:</span>
              <span className="text-slate-300 font-mono">
                {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Active session'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
              <HiOutlineKey />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
              <p className="text-[11px] text-slate-400">
                Update your administrative account login password.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-navy-900/40 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Database & Architecture Information Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <HiServerStack className="text-gold-400 text-lg" />
          <span>System & Database Architecture</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          The Admin Dashboard is isolated within <code className="text-gold-400">/admin</code> and communicates
          directly with the Express.js REST API on port 5000. All updates made across Faculty, Academics, PYQs,
          Blogs, Galleries, Campus Updates, and Notices are persisted to MongoDB and immediately reflected on the
          public frontend.
        </p>
      </div>
    </div>
  );
}
