import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineChevronRight } from 'react-icons/hi';

export default function DropdownMenu({ items = [], onItemClick, width = "w-64" }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`absolute top-full left-0 mt-1.5 ${width} bg-[#233B5D]/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn divide-y divide-slate-800/60`}
      style={{ filter: "drop-shadow(0 15px 25px rgba(35,59,93,0.5))" }}
    >
      <div className="py-1">
        {items.map((item, idx) => (
          <NavLink
            key={item.href || item.id || idx}
            to={item.href}
            onClick={onItemClick}
            className={({ isActive }) =>
              `group flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-all duration-150 rounded-lg mx-1.5 ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 font-semibold border border-gold-500/30'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/90'
              }`
            }
          >
            <div className="flex flex-col pr-2">
              <span className="group-hover:text-gold-400 transition-colors">
                {item.label}
              </span>
              {item.subtitle && (
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300 font-normal">
                  {item.subtitle}
                </span>
              )}
            </div>
            <HiOutlineChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
