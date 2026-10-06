import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineAcademicCap, 
  HiOutlineClock, 
  HiOutlineLocationMarker,
  HiOutlineBookOpen,
  HiOutlineBadgeCheck,
  HiOutlineArrowLeft
} from 'react-icons/hi';
import { useFacultyDetail } from '../../hooks/useFaculties';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function FacultyDetailPage() {
  const { id } = useParams();
  const { faculty, loading, error } = useFacultyDetail(id);

  if (loading) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4">
        <LoadingState message="Loading faculty profile details..." />
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4">
        <ErrorState
          title="Faculty Not Found"
          message={`We could not find the faculty profile '${id}'.`}
        />
        <div className="text-center mt-6">
          <Link to="/faculties" className="text-sm font-bold text-navy-900 hover:underline inline-flex items-center gap-1">
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Return to Faculty Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Faculties", href: "/faculties" },
    { label: faculty.name }
  ];

  return (
    <div>
      <PageHeader
        badge="FACULTY PROFILE"
        title={faculty.name}
        description={`${faculty.designation} • Department of Computer Application, T.P. College Madhepura`}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Back link */}
        <Link
          to="/faculties"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to All Faculties</span>
        </Link>

        {/* Profile Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Big Photo & Contact Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
              <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <img
                  src={faculty.photo}
                  alt={faculty.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{faculty.name}</h3>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">{faculty.designation}</p>
                  <p className="text-xs text-slate-500 mt-1">{faculty.qualification}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <HiOutlineMail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <a href={`mailto:${faculty.email}`} className="hover:underline truncate font-medium">
                      {faculty.email}
                    </a>
                  </div>
                  {faculty.phone && (
                    <div className="flex items-center gap-2.5">
                      <HiOutlinePhone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{faculty.phone}</span>
                    </div>
                  )}
                  {faculty.officeRoom && (
                    <div className="flex items-center gap-2.5">
                      <HiOutlineLocationMarker className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{faculty.officeRoom}</span>
                    </div>
                  )}
                  {faculty.officeHours && (
                    <div className="flex items-center gap-2.5">
                      <HiOutlineClock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{faculty.officeHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Biography, Specialization, Teaching Areas, Publications */}
          <div className="lg:col-span-8 space-y-8">
            {/* Biography */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xl font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Faculty Biography & Overview
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {faculty.bio}
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500">
                <strong>Total Academic Experience:</strong> {faculty.experience}
              </div>
            </div>

            {/* Specialization & Research Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teaching Areas */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HiOutlineBookOpen className="w-5 h-5 text-blue-700" />
                  <span>Key Teaching Areas</span>
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {faculty.teachingAreas?.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academic Interests */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HiOutlineAcademicCap className="w-5 h-5 text-amber-700" />
                  <span>Research & Academic Interests</span>
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {faculty.academicInterests?.map((interest, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Publications */}
            {faculty.publications && faculty.publications.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <HiOutlineBadgeCheck className="w-5 h-5 text-emerald-600" />
                  <span>Selected Research Publications & Papers</span>
                </h4>
                <div className="space-y-3">
                  {faculty.publications.map((pub, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium">
                      {pub}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards & Honors */}
            {faculty.awards && faculty.awards.length > 0 && (
              <div className="bg-gradient-to-r from-navy-900 to-[#0B192C] text-white rounded-3xl p-6 border border-slate-800 space-y-3">
                <h5 className="text-base font-bold text-amber-400">Honors & Recognitions</h5>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  {faculty.awards.map((award, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-amber-400">★</span>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
