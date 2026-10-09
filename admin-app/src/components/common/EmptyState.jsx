import React from 'react';
import { HiOutlineFolderOpen } from 'react-icons/hi2';

export default function EmptyState({
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
  icon: Icon = HiOutlineFolderOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="text-3xl" />
      </div>
      <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-all shadow-lg shadow-navy-900/30 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
