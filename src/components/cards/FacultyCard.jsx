import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineAcademicCap, HiOutlineArrowRight } from 'react-icons/hi';

export default function FacultyCard({ faculty }) {
  if (!faculty) return null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={faculty.photo}
            alt={faculty.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-slate-950 mb-1">
              {faculty.shortDesignation || faculty.designation}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
              {faculty.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="text-xs text-slate-600 space-y-1.5">
            <div className="flex items-start gap-2">
              <HiOutlineAcademicCap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-slate-700">{faculty.qualification}</span>
            </div>
            {faculty.specialization && (
              <div className="text-xs text-slate-500 line-clamp-2">
                <strong className="text-slate-700">Specialization:</strong> {faculty.specialization}
              </div>
            )}
          </div>

          {faculty.teachingAreas && faculty.teachingAreas.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Key Areas:</span>
              <div className="flex flex-wrap gap-1.5">
                {faculty.teachingAreas.slice(0, 2).map((area, idx) => (
                  <span key={idx} className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                    {area}
                  </span>
                ))}
                {faculty.teachingAreas.length > 2 && (
                  <span className="inline-block bg-slate-50 text-slate-500 text-[11px] px-1.5 py-0.5 rounded">
                    +{faculty.teachingAreas.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="p-5 pt-0">
        <Link
          to={`/faculties/${faculty.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#233B5D] text-slate-800 hover:text-white border border-slate-200 hover:border-transparent text-xs font-bold inline-flex items-center justify-center gap-2 transition duration-200"
        >
          <span>View Faculty Profile</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
