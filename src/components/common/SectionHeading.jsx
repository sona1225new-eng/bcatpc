import React from 'react';

export default function SectionHeading({
  title,
  titleHighlight,
  subtitle,
  align = "left", // 'left', 'center', 'between'
  action,
  className = "",
  light = false
}) {
  if (align === "between") {
    return (
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
        <div>
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
