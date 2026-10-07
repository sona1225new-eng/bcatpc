import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineDocumentDuplicate,
  HiOutlineBookOpen,
  HiOutlinePhoto,
  HiOutlineSparkles,
  HiOutlineBell,
  HiOutlineArrowRightOnRectangle,
  HiOutlineGlobeAlt,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: HiOutlineSquares2X2 },
  { name: 'Faculty', path: '/faculty', icon: HiOutlineUserGroup },
  { name: 'Academics', path: '/academics', icon: HiOutlineAcademicCap },
  { name: 'PYQ / Question Bank', path: '/pyqs', icon: HiOutlineDocumentDuplicate },
  { name: 'Blogs', path: '/blogs', icon: HiOutlineBookOpen },
  { name: 'Gallery', path: '/gallery', icon: HiOutlinePhoto },
  { name: 'Campus Updates', path: '/campus-updates', icon: HiOutlineSparkles },
  { name: 'Notices', path: '/notices', icon: HiOutlineBell },
  { name: 'Settings & Security', path: '/settings', icon: HiOutlineCog6Tooth },
];

export default function Sidebar({ isOpen, onClose }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-950">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            <span className="font-serif text-lg tracking-wider">TP</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-tight">
              T.P. College BCA
            </h1>
            <span className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Management Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`text-lg transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Quick Links & Admin Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          {/* Public Website Link */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <HiOutlineGlobeAlt className="text-base text-blue-400" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              Live
            </span>
          </a>

          {/* Admin Info Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold flex items-center justify-center text-xs shrink-0">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {admin?.role || 'Admin'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <HiOutlineArrowRightOnRectangle className="text-base" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
