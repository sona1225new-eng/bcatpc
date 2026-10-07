import React from 'react';

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3`}
      />
      {message && <p className="text-sm font-medium text-slate-400">{message}</p>}
    </div>
  );
}
