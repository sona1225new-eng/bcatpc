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
    gold: "bg-amber-400 text-slate-950 font-bold",
    wine: "bg-rose-900/90 text-rose-200 border border-rose-700/60",
    blue: "bg-blue-600/90 text-white",
    slate: "bg-slate-800 text-slate-300 border border-slate-700",
  };

  return (
    <div className={`group relative bg-slate-900/85 hover:bg-slate-900 backdrop-blur-xl border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-300 flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-transform flex-shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
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
