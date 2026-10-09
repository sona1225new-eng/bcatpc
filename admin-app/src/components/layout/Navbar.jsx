import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiBars3,
  HiOutlineGlobeAlt,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle,
} from 'react-icons/hi2';

const PAGE_TITLES = {
  '/': 'Dashboard Overview',
  '/faculty': 'Faculty Management',
  '/academics': 'Academics Program Management',
  '/pyqs': 'PYQ & Question Bank Management',
  '/blogs': 'Blog & Technical Articles',
  '/gallery': 'Photo Gallery Management',
  '/campus-updates': 'Campus Updates & Achievements',
  '/notices': 'Notices & Circulars Management',
  '/settings': 'Account Settings & Security',
};

export default function Navbar({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const title = PAGE_TITLES[location.pathname] || 'Admin Dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-slate-900/80 border-b border-slate-800 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <HiBars3 className="text-2xl" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">{title}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>BCA Department</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MongoDB Connected
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick actions & Profile */}
      <div className="flex items-center gap-3">
        {/* View Website Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700/80 rounded-xl transition-all shadow-sm"
        >
          <HiOutlineGlobeAlt className="text-base text-gold-400" />
          <span>View Public Site</span>
        </a>

        {/* Admin Pill */}
        <Link
          to="/settings"
          className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
          title="Account Settings"
        >
          <div className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold flex items-center justify-center text-xs">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-white leading-tight">
              {admin?.name || 'Admin'}
            </span>
            <span className="block text-[10px] text-slate-400">{admin?.email}</span>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <HiOutlineArrowRightOnRectangle className="text-xl" />
        </button>
      </div>
    </header>
  );
}
