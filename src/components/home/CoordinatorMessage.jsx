import React from 'react';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { coordinatorData } from '../../data/coordinator';

export default function CoordinatorMessage() {
  const {
    name,
    designation,
    institution,
    photo,
    badge,
    title,
    message,
  } = coordinatorData;

  return (
    <section className="py-10 md:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Label */}
        <div className="flex items-center justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <span>★</span>
            <span>{badge || 'DESK OF THE COORDINATOR'}</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 sm:gap-8 shadow-sm hover:shadow-md transition-shadow duration-300">

          {/* Photo + Identity */}
          <div className="flex-shrink-0 flex flex-col items-center sm:items-start gap-3 w-full sm:w-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-slate-200 shadow-md flex-shrink-0">
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-extrabold text-slate-900 leading-tight">{name}</p>
              <p className="text-[11px] font-semibold text-amber-700 mt-0.5">{designation}</p>
              {institution && (
                <p className="text-[10px] text-slate-400 mt-0.5">{institution}</p>
              )}
            </div>
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden sm:block w-px self-stretch bg-slate-200" />

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-3">
              {title}
            </h2>
            <div className="flex items-start gap-2.5">
              <HiOutlineChatAlt2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
