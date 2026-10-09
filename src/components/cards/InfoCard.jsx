import React from 'react';
import { 
  HiAcademicCap, 
  HiOutlineBookOpen, 
  HiOutlineBriefcase, 
  HiOutlineDesktopComputer,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const iconMap = {
  academic: HiAcademicCap,
  book: HiOutlineBookOpen,
  briefcase: HiOutlineBriefcase,
  computer: HiOutlineDesktopComputer,
  lightning: HiOutlineLightningBolt,
  shield: HiOutlineShieldCheck,
};

export default function InfoCard({
  icon = "academic",
  title,
  subtitle,
  badgeText,
  badgeVariant = "gold",
  className = ""
}) {
  const IconComponent = iconMap[icon] || HiAcademicCap;

  const badgeStyles = {
    gold: "bg-gold-500 text-navy-900 font-bold",
    wine: "bg-navy-900 text-white border border-navy-800",
    blue: "bg-slate-100 text-navy-900 border border-slate-200",
    slate: "bg-slate-100 text-navy-900 border border-slate-200",
  };

  return (
    <div className={`group relative bg-white hover:bg-slate-50 backdrop-blur-xl border border-slate-200 hover:border-gold-500/50 rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-300 flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 border border-gold-500/30 flex items-center justify-center text-navy-800 group-hover:scale-105 group-hover:border-gold-500 transition-transform flex-shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-navy-900 tracking-tight group-hover:text-navy-800 transition-colors">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {badgeText && (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${badgeStyles[badgeVariant] || badgeStyles.gold}`}>
          {badgeText}
        </span>
      )}
    </div>
  );
}
