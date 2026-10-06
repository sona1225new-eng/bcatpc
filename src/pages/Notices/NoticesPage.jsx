import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotices } from '../../hooks/useNotices';
import NoticeCard from '../../components/cards/NoticeCard';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function NoticesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const { notices, loading, error, refetch } = useNotices({ category, search });

  const categories = ['All', 'Admission', 'Examination', 'Official', 'Department', 'Campus Life'];

  const breadcrumbs = [
    { label: "Notices", href: "/notices" },
    { label: "Official Circulars & Announcements" }
  ];

  return (
    <div>
      <PageHeader
        badge="DEPARTMENT NOTIFICATION BOARD"
        title="Official Circulars &"
        highlight="Notices"
        description="Access official departmental orders, university examination routines, admission schedules, and administrative circulars for T.P. College Madhepura."
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setSearchParams(cat === 'All' ? {} : { category: cat });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  category === cat
                    ? 'bg-[#0B192C] text-amber-400 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'All Notices' : cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search circulars, exams, ref no..."
            />
          </div>
        </div>

        {/* Notice List */}
        {loading ? (
          <LoadingState message="Fetching official circulars..." count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : notices.length === 0 ? (
          <EmptyState
            title="No notices found"
            message={`No circulars found matching '${search || category}'.`}
            actionText="Clear Filter"
            onAction={() => {
              setSearch('');
              setCategory('All');
              setSearchParams({});
            }}
          />
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} variant="full" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
