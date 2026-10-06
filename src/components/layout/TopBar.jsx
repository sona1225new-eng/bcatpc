import React from 'react';
import { HiOutlinePhone, HiOutlineMail, HiOutlineSparkles, HiOutlineAcademicCap } from 'react-icons/hi';
import { siteConfig } from '../../config/siteConfig';

export default function TopBar() {
  return (
    <div className="bg-[#070D18] text-slate-300 text-xs border-b border-slate-800/80 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Contact Helplines */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-[11px] sm:text-xs">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <HiOutlinePhone className="w-3.5 h-3.5 text-amber-500" />
            <span>Phone: {siteConfig.contact.phone}</span>
          </a>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <HiOutlineMail className="w-3.5 h-3.5 text-amber-500" />
            <span>Email: {siteConfig.contact.email}</span>
          </a>
        </div>

        {/* Right: Affiliation & Accreditation Badges */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs">
          <span className="hidden lg:inline text-slate-400">
            {siteConfig.affiliation}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-[10px] sm:text-[11px] flex items-center gap-1">
            <HiOutlineAcademicCap className="w-3 h-3" />
            <span>{siteConfig.accreditation}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
