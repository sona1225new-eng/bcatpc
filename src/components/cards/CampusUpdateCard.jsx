import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi';

export default function CampusUpdateCard({ update }) {
  if (!update) return null;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Featured Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={update.image}
            alt={update.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-navy-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
              {update.category}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
            <HiOutlineCalendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{update.formattedDate || update.date}</span>
            {update.readTime && <span>• {update.readTime}</span>}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
            <Link to={`/campus-updates/${update.id}`}>
              {update.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {update.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-5 pt-0">
        <Link
          to={`/campus-updates/${update.id}`}
          className="text-xs font-bold text-navy-800 group-hover:text-amber-600 inline-flex items-center gap-1.5 transition-colors"
        >
          <span>Read Full Story</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
