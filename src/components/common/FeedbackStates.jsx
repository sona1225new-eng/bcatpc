import React from 'react';

export function LoadingState({ message = "Loading information...", count = 3, type = "card" }) {
  if (type === "inline") {
    return (
      <div className="flex items-center justify-center py-12 space-x-3 text-slate-500">
        <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }

  return (
    <div className="w-full py-8 space-y-4">
      <div className="flex items-center justify-center space-x-3 text-slate-500 mb-6">
        <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-slate-600">{message}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm animate-pulse space-y-4"
          >
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded w-4/5"></div>
            <div className="h-16 bg-slate-100 rounded"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-8 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ title = "Unable to load data", message = "An error occurred while fetching information. Please try again.", onRetry }) {
  return (
    <div className="w-full my-8 p-8 rounded-2xl bg-red-50/70 border border-red-200 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition shadow-sm hover:shadow"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "No records found", message = "There are no items matching your criteria at this moment.", actionText, onAction }) {
  return (
    <div className="w-full my-8 p-10 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
