import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFacultyDetail } from '../../hooks/useFaculties';
import { getPublicFileUrl, isPublicResumeUrl } from '../../services/api';

export default function FacultyResumePage() {
  const { id } = useParams();
  const { faculty, loading, error } = useFacultyDetail(id);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const resumeUrl = isPublicResumeUrl(faculty?.resumeUrl)
    ? getPublicFileUrl(faculty.resumeUrl)
    : '';

  const message = error
    ? 'Unable to load this resume.'
    : faculty && !resumeUrl
      ? 'This resume is unavailable.'
      : pdfError
        ? 'Unable to display this PDF.'
        : '';

  return (
    <div className="fixed inset-0 z-[100] flex h-[100dvh] flex-col overflow-hidden bg-slate-950">
      <div className="flex h-12 shrink-0 items-center px-3">
        <Link
          to="/faculties"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          Back
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-white" role="status">
          Loading PDF…
        </div>
      ) : message ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-white" role="alert">
          {message}
        </div>
      ) : (
        <div className="relative min-h-0 flex-1">
          {!pdfLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950 text-sm text-white" role="status">
              Loading PDF…
            </div>
          )}
          <iframe
            key={resumeUrl}
            src={resumeUrl}
            title="Faculty resume PDF"
            className="h-full w-full border-0"
            onLoad={() => setPdfLoaded(true)}
            onError={() => setPdfError(true)}
          />
        </div>
      )}
    </div>
  );
}
