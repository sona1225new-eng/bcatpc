import React from 'react';
import { HiOutlineEye, HiOutlineCalendar } from 'react-icons/hi';

export default function GalleryCard({ item, onClick }) {
  if (!item) return null;

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 aspect-[4/3]"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Floating Category Badge */}
      <div className="absolute top-3 left-3">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-navy-950/80 backdrop-blur text-amber-400 border border-amber-400/30">
          {item.category}
        </span>
      </div>

      {/* Hover Eye Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <HiOutlineEye className="w-6 h-6" />
        </div>
      </div>

      {/* Caption at bottom */}
      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-md line-clamp-1 group-hover:text-amber-300 transition-colors">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 opacity-90">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
