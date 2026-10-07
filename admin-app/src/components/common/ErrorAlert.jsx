import React from 'react';
import { HiExclamationCircle, HiArrowPath } from 'react-icons/hi2';

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl my-4">
      <div className="flex items-center gap-3">
        <HiExclamationCircle className="text-xl text-rose-400 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <HiArrowPath className="text-sm" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
