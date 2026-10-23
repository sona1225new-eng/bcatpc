import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDownload, HiOutlineEye } from 'react-icons/hi';
import { getPublicFileUrl } from '../../services/api';

export default function PYQCard({ paper }) {
  if (!paper) return null;

  const paperId = paper._id || paper.id;
  const pdfUrl = getPublicFileUrl(paper.fileUrl);

  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-gold-500 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide bg-ivory text-navy-900 border border-slate-200">
            {paper.subjectCode}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {paper.year}
          </span>
        </div>

        {/* Subject Title */}
        <h3 className="text-base font-extrabold text-navy-900 group-hover:text-navy-800 transition-colors line-clamp-2 leading-tight">
          <Link to={paperId ? `/pyqs/${paperId}` : '/pyqs'}>
            {paper.subject}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {paper.description}
        </p>

        {/* Topics Tags */}
        {paper.topicsCovered && paper.topicsCovered.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {paper.topicsCovered.slice(0, 2).map((topic, idx) => (
              <span key={idx} className="text-[10px] font-medium bg-slate-50 text-muted border border-slate-200 px-1.5 py-0.5 rounded">
                {topic}
              </span>
            ))}
            {paper.topicsCovered.length > 2 && (
              <span className="text-[10px] text-muted px-1">+{paper.topicsCovered.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-muted">
          {paper.fileSize || "PDF"} • {paper.downloadsCount ? `${paper.downloadsCount} DLs` : "BNMU"}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            to={paperId ? `/pyqs/${paperId}` : '/pyqs'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Preview Question Details"
          >
            <HiOutlineEye className="w-4 h-4" />
          </Link>
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs"
              title="Open PDF"
            >
              <HiOutlineDownload className="w-3.5 h-3.5" />
              <span>View PDF</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-xl bg-navy-900 text-white text-xs font-bold inline-flex items-center gap-1.5 opacity-50 cursor-not-allowed"
              title="PDF unavailable"
            >
              <HiOutlineDownload className="w-3.5 h-3.5" />
              <span>PDF unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
