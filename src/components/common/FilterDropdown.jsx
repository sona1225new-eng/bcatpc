import React from 'react';
import { HiChevronDown } from 'react-icons/hi';

export default function FilterDropdown({
  label,
  value,
  onChange,
  options = [],
  className = "",
  allLabel = "All Categories"
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-white text-slate-800 text-sm font-medium py-2.5 pl-3.5 pr-10 rounded-xl border border-slate-300/80 hover:border-slate-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 shadow-xs transition duration-150 outline-none cursor-pointer"
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
