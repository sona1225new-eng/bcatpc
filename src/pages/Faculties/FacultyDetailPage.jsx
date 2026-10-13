import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useFacultyDetail } from '../../hooks/useFaculties';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getPublicFileUrl, isPublicResumeUrl } from '../../services/api';

export default function FacultyDetailPage() {
  const { id } = useParams();
  const { faculty, loading, error } = useFacultyDetail(id);
  const resumeUrl = isPublicResumeUrl(faculty?.resumeUrl)
    ? getPublicFileUrl(faculty.resumeUrl)
    : '';

  if (loading) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4">
        <LoadingState message="Loading faculty resume..." />
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4">
        <ErrorState
          title="Faculty Not Found"
          message={error || `We could not find the faculty profile '${id}'.`}
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/faculties"
        className="mb-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span>Back to All Faculties</span>
      </Link>

      {resumeUrl ? (
        <iframe
          src={resumeUrl}
          title="Faculty resume PDF"
          className="block h-[75vh] min-h-[520px] w-full rounded-xl border border-slate-200 bg-slate-100 sm:h-[80vh]"
        />
      ) : (
        <div className="flex min-h-[45vh] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-center text-sm text-slate-600">
          This faculty resume is unavailable.
        </div>
      )}
    </section>
  );
}
