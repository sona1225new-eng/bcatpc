import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlineCalendar, HiOutlineArrowRight, HiOutlineDownload } from 'react-icons/hi';

export default function NoticeCard({ notice, variant = "default" }) {
  if (!notice) return null;

  const categoryColors = {
    Admission: "text-navy-900 bg-slate-50 border-slate-200",
    Examination: "text-navy-900 bg-slate-50 border-slate-200",
    Department: "text-navy-900 bg-slate-50 border-slate-200",
    "Campus Life": "text-navy-900 bg-slate-50 border-slate-200",
    Official: "text-navy-900 bg-slate-50 border-slate-200",
  };

  const badgeClass = categoryColors[notice.category] || "text-slate-700 bg-slate-100 border-slate-200";

  // Compact card for Home Page Notice Board
  if (variant === "compact") {
    return (
      <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-gold-500/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
              {notice.category}
            </span>
            <span className="text-xs font-medium text-muted flex items-center gap-1">
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              {notice.formattedDate || notice.date}
            </span>
          </div>

          <h3 className="text-base font-bold text-navy-900 group-hover:text-navy-800 transition-colors line-clamp-2 leading-snug">
            <Link to={`/notices/${notice.id}`}>
              {notice.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {notice.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <Link
            to={`/notices/${notice.id}`}
            className="text-navy-800 hover:text-navy-900 inline-flex items-center gap-1 group-hover:underline"
          >
            <span>Read Details</span>
            <HiOutlineArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {notice.documentUrl && (
            <a
              href={notice.documentUrl}
              className="text-muted hover:text-navy-800 inline-flex items-center gap-1"
              title="Download Attached Circular PDF"
              onClick={(e) => {
                if (notice.documentUrl.startsWith('#')) {
                  e.preventDefault();
                  alert(`Downloading: ${notice.documentName || 'Notice.pdf'}`);
                }
              }}
            >
              <HiOutlineDownload className="w-4 h-4 text-gold-500" />
              <span className="text-[11px] text-muted font-normal">{notice.documentSize || 'PDF'}</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Full detail card for /notices listing page
  return (
    <article className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-gold-500/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
            {notice.category}
          </span>
          {notice.isUrgent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white">
              Urgent
            </span>
          )}
          {notice.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
              New
            </span>
          )}
          <span className="text-xs text-muted flex items-center gap-1 ml-auto md:ml-2">
            <HiOutlineCalendar className="w-3.5 h-3.5" />
            {notice.formattedDate || notice.date}
          </span>
          {notice.referenceNo && (
            <span className="text-[11px] font-mono text-muted bg-slate-100 px-2 py-0.5 rounded">
              Ref: {notice.referenceNo}
            </span>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-extrabold text-navy-900 group-hover:text-navy-800 transition-colors">
          <Link to={`/notices/${notice.id}`}>
            {notice.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
          {notice.description}
        </p>

        {notice.author && (
          <div className="mt-3 text-xs text-muted">
            Issued by: <span className="font-semibold text-slate-600">{notice.author}</span>
          </div>
        )}
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end gap-3 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
        <Link
          to={`/notices/${notice.id}`}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition shadow-xs hover:shadow"
        >
          <span>View Notice</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </Link>

        {notice.documentUrl && (
          <a
            href={notice.documentUrl}
            onClick={(e) => {
              if (notice.documentUrl.startsWith('#')) {
                e.preventDefault();
                alert(`Downloading notice PDF: ${notice.documentName || 'Notice.pdf'}`);
              }
            }}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-slate-200 hover:border-gold-500 hover:bg-ivory text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
          >
            <HiOutlineDownload className="w-4 h-4 text-gold-500" />
            <span>PDF ({notice.documentSize || 'Download'})</span>
          </a>
        )}
      </div>
    </article>
  );
}
