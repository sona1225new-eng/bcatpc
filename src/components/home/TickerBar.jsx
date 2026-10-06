import React from 'react';
import { Link } from 'react-router-dom';
import { useNotices } from '../../hooks/useNotices';

export default function TickerBar() {
  const { notices } = useNotices({ limit: 6 });

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 py-2.5 px-4 shadow-md overflow-hidden relative z-20 border-y border-amber-600/30">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Static Badge on Left */}
        <div className="flex-shrink-0 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
            <span>⚡</span>
            <span>LATEST UPDATES</span>
          </span>
        </div>

        {/* Dynamic Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker flex items-center space-x-8 text-xs sm:text-sm font-bold tracking-tight">
            {notices.map((notice) => (
              <Link
                key={notice.id}
                to={`/notices/${notice.id}`}
                className="hover:underline hover:text-slate-900 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-slate-950">★</span>
                <span>{notice.title}</span>
                <span className="text-[10px] bg-slate-950/20 text-slate-900 px-1.5 py-0.2 rounded font-mono font-bold">
                  {notice.category}
                </span>
              </Link>
            ))}
            {/* Duplicate for seamless infinite loop */}
            {notices.map((notice) => (
              <Link
                key={`dup-${notice.id}`}
                to={`/notices/${notice.id}`}
                className="hover:underline hover:text-slate-900 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-slate-950">★</span>
                <span>{notice.title}</span>
                <span className="text-[10px] bg-slate-950/20 text-slate-900 px-1.5 py-0.2 rounded font-mono font-bold">
                  {notice.category}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick View All Link */}
        <div className="hidden md:flex flex-shrink-0 pl-2">
          <Link
            to="/notices"
            className="text-[11px] font-extrabold text-slate-950 hover:underline uppercase tracking-wider"
          >
            All Notices →
          </Link>
        </div>
      </div>
    </div>
  );
}
