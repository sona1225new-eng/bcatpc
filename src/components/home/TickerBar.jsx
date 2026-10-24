import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { useNotices } from '../../hooks/useNotices';

export default function TickerBar() {
  const { notices, loading, error } = useNotices({ limit: 6 });

  return (
    <div className="bg-[#F7F6F2] text-navy-900 py-2.5 px-4 shadow-md overflow-hidden relative z-20 border-y border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Static Badge on Left */}
        <div className="flex-shrink-0 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--college-logo-red)] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
            <HiOutlineLightningBolt className="w-3.5 h-3.5" aria-hidden="true" />
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
            <p className="text-xs sm:text-sm font-semibold text-navy-900" role="status">
              Loading latest notices…
            </p>
          ) : error ? (
            <p className="text-xs sm:text-sm font-semibold text-navy-900" role="status">
              Latest notices are temporarily unavailable.
            </p>
          ) : notices.length === 0 ? (
            <p className="text-xs sm:text-sm font-semibold text-navy-900">
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
                  <span className="text-navy-900">★</span>
                  <span>{notice.title}</span>
                  <span className="text-[10px] bg-navy-900/10 text-navy-900 px-1.5 py-0.2 rounded font-mono font-bold">
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
                  <span className="text-navy-900">★</span>
                  <span>{notice.title}</span>
                  <span className="text-[10px] bg-navy-900/10 text-navy-900 px-1.5 py-0.2 rounded font-mono font-bold">
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
            className="text-[11px] font-extrabold text-navy-900 hover:underline uppercase tracking-wider"
          >
            All Notices →
          </Link>
        </div>
      </div>
    </div>
  );
}
