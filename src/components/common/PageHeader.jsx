import React from 'react';
import Breadcrumb from './Breadcrumb';

export default function PageHeader({
  badge,
  title,
  highlight,
  description,
  breadcrumbs = [],
  children,
  stats
}) {
  return (
    <div className="relative bg-[#0B192C] text-white pt-10 pb-12 md:pb-16 border-b border-slate-800 overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb row */}
        {breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        <div className="max-w-3xl">
          {badge && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-400/30 mb-3">
              {badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title} {highlight && <span className="text-amber-400">{highlight}</span>}
          </h1>
          {description && (
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Optional Stats or Actions Slot */}
        {stats && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl p-3.5">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
