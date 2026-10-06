import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDownload, HiOutlineEye, HiOutlineDocumentText } from 'react-icons/hi';

export default function PYQCard({ paper }) {
  if (!paper) return null;

  const handleDownload = (e) => {
    e.preventDefault();
    alert(`Downloading Question Paper: ${paper.fileName || `${paper.subject}_${paper.year}.pdf`}`);
  };

  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide bg-blue-50 text-blue-800 border border-blue-200">
            {paper.subjectCode}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {paper.year}
          </span>
        </div>

        {/* Subject Title */}
        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-tight">
          <Link to={`/pyqs/${paper.id}`}>
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
              <span key={idx} className="text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded">
                {topic}
              </span>
            ))}
            {paper.topicsCovered.length > 2 && (
              <span className="text-[10px] text-slate-400 px-1">+{paper.topicsCovered.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-400">
          {paper.fileSize || "PDF"} • {paper.downloadsCount ? `${paper.downloadsCount} DLs` : "BNMU"}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/pyqs/${paper.id}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Preview Question Details"
          >
            <HiOutlineEye className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs"
            title="Download PDF"
          >
            <HiOutlineDownload className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
