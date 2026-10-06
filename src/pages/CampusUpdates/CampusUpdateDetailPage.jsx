import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineUser, HiOutlineTag, HiOutlineArrowLeft, HiOutlineShare } from 'react-icons/hi';
import { useCampusUpdateDetail, useCampusUpdates } from '../../hooks/useCampusUpdates';
import PageHeader from '../../components/common/PageHeader';
import CampusUpdateCard from '../../components/cards/CampusUpdateCard';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function CampusUpdateDetailPage() {
  const { id } = useParams();
  const { update, loading, error } = useCampusUpdateDetail(id);
  const { updates: relatedUpdates } = useCampusUpdates({ limit: 3 });

  if (loading) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4">
        <LoadingState message="Loading story..." />
      </div>
    );
  }

  if (error || !update) {
    return (
      <div className="py-24 max-w-5xl mx-auto px-4">
        <ErrorState
          title="Story Not Found"
          message={`The campus update '${id}' was not found.`}
        />
        <div className="text-center mt-6">
          <Link to="/campus-updates" className="text-sm font-bold text-navy-900 hover:underline">
            ← Back to Campus Updates
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Campus Updates", href: "/campus-updates" },
    { label: update.title }
  ];

  return (
    <div>
      <PageHeader
        badge={update.category}
        title={update.title}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Back Link */}
        <Link
          to="/campus-updates"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to All Stories</span>
        </Link>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <img
            src={update.image}
            alt={update.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>

        {/* Article Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs sm:text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <HiOutlineUser className="w-4 h-4 text-amber-600" />
              {update.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4" />
              {update.formattedDate || update.date}
            </span>
            {update.readTime && <span>• {update.readTime}</span>}
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Story link copied to clipboard!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <HiOutlineShare className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            {update.shortDescription}
          </p>
          <div className="whitespace-pre-line text-slate-700 space-y-4">
            {update.content}
          </div>
        </div>

        {/* Tags */}
        {update.tags && update.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags:</span>
            {update.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Updates */}
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">More Campus Stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedUpdates.filter(u => u.id !== update.id).slice(0, 3).map((item) => (
              <CampusUpdateCard key={item.id} update={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
