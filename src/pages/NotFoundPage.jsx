import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch, HiOutlineAcademicCap } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-600 text-4xl font-black shadow-inner">
          404
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            The page or resource you are looking for might have been moved, removed, or is temporarily unavailable on the T.P. College BCA portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B192C] hover:bg-slate-900 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition"
          >
            <HiOutlineHome className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/pyqs"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition"
          >
            <span>Browse PYQs</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-400">
          Department of Computer Application • T.P. College Madhepura
        </div>
      </div>
    </div>
  );
}
