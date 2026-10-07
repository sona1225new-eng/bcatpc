import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variantStyles = {
    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    archived: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    inactive: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border tracking-wide uppercase ${style} ${sizeStyle}`}
    >
      {children}
    </span>
  );
}
