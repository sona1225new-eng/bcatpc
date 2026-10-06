import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineCalendar, 
  HiOutlineDownload, 
  HiOutlineTag, 
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { useNoticeDetail } from '../../hooks/useNotices';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const { notice, loading, error } = useNoticeDetail(id);

  if (loading) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4">
        <LoadingState message="Loading notice document..." />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4">
        <ErrorState
          title="Notice Not Found"
          message={`We could not locate notice with reference '${id}'.`}
        />
        <div className="text-center mt-6">
          <Link to="/notices" className="text-sm font-bold text-navy-900 hover:underline">
            ← Return to All Notices
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Notices", href: "/notices" },
    { label: notice.title }
  ];

  return (
    <div>
      <PageHeader
        badge={notice.category}
        title={notice.title}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Back Link */}
        <Link
          to="/notices"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to All Notices</span>
        </Link>

        {/* Notice Sheet Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
          {/* Top Circular Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                  {notice.category} Notice
                </span>
                {notice.isUrgent && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                    Urgent
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {notice.title}
              </h2>
            </div>

            <div className="text-right text-xs text-slate-500 flex-shrink-0 space-y-1">
              <div><strong>Date:</strong> {notice.formattedDate || notice.date}</div>
              {notice.referenceNo && (
                <div className="font-mono bg-slate-100 px-2 py-1 rounded">
                  Ref: {notice.referenceNo}
                </div>
              )}
            </div>
          </div>

          {/* Description highlight */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800">
            {notice.description}
          </div>

          {/* Detailed Content */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {notice.content}
          </div>

          {/* Signatory */}
          {notice.author && (
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <HiOutlineShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Verified Official Communication</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{notice.author}</div>
                <div className="text-slate-500 text-xs">Department of Computer Application, T.P. College</div>
              </div>
            </div>
          )}

          {/* Download Box */}
          {notice.documentUrl && (
            <div className="pt-6 border-t border-slate-100">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
                    <HiOutlineDocumentText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {notice.documentName || "Official Notice PDF Document"}
                    </h4>
                    <p className="text-xs text-slate-600">Official signed circular file • {notice.documentSize || "PDF"}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading: ${notice.documentName || 'Notice.pdf'}`)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <HiOutlineDownload className="w-4 h-4 text-amber-400" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
