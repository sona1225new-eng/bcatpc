import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineCalendar, 
  HiOutlineDownload, 
  HiOutlineArrowLeft, 
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { usePYQDetail } from '../../hooks/usePYQs';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function PYQDetailPage() {
  const { id } = useParams();
  const { paper, loading, error } = usePYQDetail(id);

  if (loading) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4">
        <LoadingState message="Loading question paper..." />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4">
        <ErrorState
          title="Question Paper Not Found"
          message={`We could not locate question paper '${id}'.`}
        />
        <div className="text-center mt-6">
          <Link to="/pyqs" className="text-sm font-bold text-navy-900 hover:underline">
            ← Back to Question Bank Hub
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "PYQs", href: "/pyqs" },
    { label: paper.semesterLabel, href: `/pyqs/${paper.semester}` },
    { label: `${paper.subject} (${paper.year})` }
  ];

  return (
    <div>
      <PageHeader
        badge={paper.subjectCode}
        title={paper.subject}
        highlight={`(${paper.year})`}
        description={`${paper.examType} • ${paper.semesterLabel} • Department of Computer Application, T.P. College Madhepura`}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        {/* Back Link */}
        <Link
          to={`/pyqs/${paper.semester}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to {paper.semesterLabel} Question Papers</span>
        </Link>

        {/* Paper Details Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900">
                {paper.subjectCode} • {paper.semesterLabel}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                {paper.subject}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="bg-slate-100 font-bold text-slate-800 px-3 py-1.5 rounded-xl">
                Year: {paper.year}
              </span>
              <span className="bg-amber-100 font-bold text-amber-900 px-3 py-1.5 rounded-xl">
                {paper.paperType || "Theory"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 mb-1">Examination Scope:</h4>
            <p>{paper.description}</p>
          </div>

          {/* Syllabus Topics Tested */}
          {paper.topicsCovered && paper.topicsCovered.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Topics & Syllabus Units Evaluated:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paper.topicsCovered.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800">
                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paper specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Max Marks</div>
              <div className="text-base font-bold text-slate-900">{paper.maxMarks || 80} Marks</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Duration</div>
              <div className="text-base font-bold text-slate-900">{paper.duration || "3 Hours"}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Exam Body</div>
              <div className="text-base font-bold text-slate-900">BNMU</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">File Size</div>
              <div className="text-base font-bold text-slate-900">{paper.fileSize || "850 KB"}</div>
            </div>
          </div>

          {/* Download Box */}
          <div className="bg-gradient-to-r from-navy-900 to-[#0B192C] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Download Verified PDF</h4>
              <p className="text-xs text-slate-400 mt-0.5">Filename: {paper.fileName || `${paper.subjectCode}_${paper.year}.pdf`}</p>
            </div>
            <button
              onClick={() => alert(`Downloading: ${paper.fileName || `${paper.subject}_${paper.year}.pdf`}`)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg transition"
            >
              <HiOutlineDownload className="w-5 h-5" />
              <span>Download Question Paper</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
