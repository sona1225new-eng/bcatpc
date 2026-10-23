import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDownload, HiOutlineEye } from 'react-icons/hi';
import { getPublicFileUrl } from '../../services/api';

export default function PYQCard({ paper }) {
  if (!paper) return null;

  const paperId = paper._id || paper.id;
  const detailPath = paperId ? `/pyqs/${paperId}` : null;
  const pdfUrl = getPublicFileUrl(paper.fileUrl);
  const title = paper.title || paper.subject || 'Question paper';
  const semester =
    paper.semesterLabel ||
    (paper.semesterNumber ? `Semester ${paper.semesterNumber}` : paper.semester);

  return (
    <article className="flex min-w-0 flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-gold-500 hover:shadow-md">
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-navy-900">
          {detailPath ? (
            <Link to={detailPath} className="transition-colors hover:text-amber-700">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-600">
          {semester && <span>{semester}</span>}
          {semester && paper.year && <span aria-hidden="true">•</span>}
          {paper.year && <span>{paper.year}</span>}
          {(semester || paper.year) && paper.paperType && <span aria-hidden="true">•</span>}
          {paper.paperType && <span>{paper.paperType}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
        {detailPath ? (
          <Link
            to={detailPath}
            className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-navy-900 transition hover:border-amber-400 hover:bg-amber-50"
            title="View paper details and PDF"
          >
            <HiOutlineEye className="h-4 w-4" />
            <span>View PDF</span>
          </Link>
        ) : (
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-400">
            <HiOutlineEye className="h-4 w-4" />
            <span>View unavailable</span>
          </span>
        )}

        {pdfUrl ? (
          <a
            href={pdfUrl}
            download={paper.fileName || `${title}.pdf`}
            className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg bg-navy-900 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-navy-800"
            title="Download question paper PDF"
          >
            <HiOutlineDownload className="h-4 w-4" />
            <span>Download</span>
          </a>
        ) : (
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-400">
            <HiOutlineDownload className="h-4 w-4" />
            <span>Unavailable</span>
          </span>
        )}
      </div>
    </article>
  );
}
