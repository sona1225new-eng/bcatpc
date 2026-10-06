import React from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  size = "md"
}) {
  const sizeClasses = {
    sm: "py-1.5 pl-9 pr-7 text-xs",
    md: "py-2.5 pl-10 pr-9 text-sm",
    lg: "py-3.5 pl-12 pr-10 text-base",
  };

  const iconSizes = {
    sm: "w-4 h-4 left-3",
    md: "w-4 h-4 left-3.5",
    lg: "w-5 h-5 left-4",
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <HiSearch className={`absolute ${iconSizes[size]} text-slate-400 pointer-events-none`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-300/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition duration-150 outline-none ${sizeClasses[size]}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
          title="Clear search"
        >
          <HiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
