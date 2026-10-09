import React from 'react';

export default function SectionHeading({
  badge,
  badgeVariant = "wine", // 'wine', 'gold', 'blue', 'navy'
  title,
  titleHighlight,
  subtitle,
  align = "left", // 'left', 'center', 'between'
  action,
  className = "",
  light = false
}) {
  const badgeStyles = {
    wine: "text-navy-900 bg-ivory border-slate-200",
    gold: "text-navy-900 bg-gold-500/15 border-gold-500/30",
    blue: "text-navy-900 bg-ivory border-slate-200",
    navy: "text-navy-900 bg-slate-100 border-slate-200",
    darkGold: "text-gold-400 bg-gold-500/10 border-gold-500/30",
    darkWine: "text-gold-400 bg-gold-500/10 border-gold-500/30",
  };

  const getBadgeClass = () => {
    if (light) {
      return badgeVariant === "gold" ? badgeStyles.darkGold : badgeStyles.darkWine;
    }
    return badgeStyles[badgeVariant] || badgeStyles.wine;
  };

  if (align === "between") {
    return (
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
        <div>
          {badge && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border mb-2.5 ${getBadgeClass()}`}>
              {badge}
            </span>
          )}
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
            {title} {titleHighlight && <span className={light ? 'text-gold-400' : 'text-navy-800'}>{titleHighlight}</span>}
          </h2>
        </div>
        {subtitle && (
          <p className={`max-w-md text-sm md:text-base ${light ? 'text-slate-300' : 'text-slate-600'}`}>
            {subtitle}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }

  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left'} ${className}`}>
      {badge && (
        <div className={`inline-block mb-2.5`}>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${getBadgeClass()}`}>
            {badge}
          </span>
        </div>
      )}
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'} leading-tight`}>
        {title} {titleHighlight && <span className={light ? 'text-gold-400' : 'text-navy-800'}>{titleHighlight}</span>}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base ${light ? 'text-slate-300' : 'text-slate-600'} ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
