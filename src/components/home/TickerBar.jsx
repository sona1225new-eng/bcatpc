import React from 'react';
import { Link } from 'react-router-dom';
import { useNotices } from '../../hooks/useNotices';

export default function TickerBar() {
  const { notices, loading, error } = useNotices({ limit: 6 });

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-2.5 px-4 shadow-md overflow-hidden relative z-20 border-y border-navy-800">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Static Badge on Left */}
        <div className="flex-shrink-0 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500 text-slate-900 font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
            <span>⚡</span>
            <span>LATEST UPDATES</span>
          </span>
        </div>

        {/* Dynamic Scrolling Marquee */}
        <div
          className="ticker-viewport flex-1 overflow-hidden relative"
          role="region"
          aria-label="Latest notices"
        >
          {loading ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-100" role="status">
              Loading latest notices…
            </p>
          ) : error ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-100" role="status">
              Latest notices are temporarily unavailable.
            </p>
          ) : notices.length === 0 ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-100">
              No notices available.
            </p>
          ) : (
            <div className="animate-ticker flex items-center space-x-8 text-xs sm:text-sm font-bold tracking-tight">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="hover:underline hover:text-slate-900 inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-gold-400">★</span>
                  <span>{notice.title}</span>
                  <span className="text-[10px] bg-white/10 text-slate-100 px-1.5 py-0.2 rounded font-mono font-bold">
                    {notice.category}
                  </span>
                </Link>
              ))}
              {/* Duplicate for a seamless loop; keep copies out of keyboard navigation. */}
              {notices.map((notice) => (
                <Link
                  key={`dup-${notice.id}`}
                  to={`/notices/${notice.id}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="ticker-duplicate hover:underline hover:text-slate-900 inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-gold-400">★</span>
                  <span>{notice.title}</span>
                  <span className="text-[10px] bg-white/10 text-slate-100 px-1.5 py-0.2 rounded font-mono font-bold">
                    {notice.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick View All Link */}
        <div className="hidden md:flex flex-shrink-0 pl-2">
          <Link
            to="/notices"
            className="text-[11px] font-extrabold text-slate-100 hover:underline uppercase tracking-wider"
          >
            All Notices →
          </Link>
        </div>
      </div>
    </div>
  );
}
