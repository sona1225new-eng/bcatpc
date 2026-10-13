import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineDocumentText } from 'react-icons/hi';
import { getPublicFileUrl, isPublicResumeUrl } from '../../services/api';

export default function FacultyCard({ faculty }) {
  if (!faculty) return null;
  const resumeUrl = isPublicResumeUrl(faculty.resumeUrl)
    ? getPublicFileUrl(faculty.resumeUrl)
    : '';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={getPublicFileUrl(faculty.photo)}
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
          <p className="text-xs text-slate-600">
            {faculty.designation || faculty.shortDesignation || 'Faculty Member'}
          </p>
        </div>
      </div>

      {/* Footer link */}
      <div className="p-5 pt-0 space-y-2">
        {resumeUrl && (
          <Link
            to={`/faculties/${faculty._id || faculty.id}/resume`}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold inline-flex items-center justify-center gap-2 transition duration-200"
          >
            <HiOutlineDocumentText className="w-4 h-4" />
            <span>View Full Resume</span>
          </Link>
        )}
        <Link
          to={`/faculties/${faculty._id || faculty.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#233B5D] text-slate-800 hover:text-white border border-slate-200 hover:border-transparent text-xs font-bold inline-flex items-center justify-center gap-2 transition duration-200"
        >
          <span>View Faculty Profile</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
