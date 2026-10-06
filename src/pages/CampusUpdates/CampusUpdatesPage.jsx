import React, { useState } from 'react';
import { useCampusUpdates } from '../../hooks/useCampusUpdates';
import CampusUpdateCard from '../../components/cards/CampusUpdateCard';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

export default function CampusUpdatesPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { updates, loading, error, refetch } = useCampusUpdates({ category, search });

  const categories = ['All', 'Achievement', 'Infrastructure', 'Workshop', 'Placement'];

  const breadcrumbs = [
    { label: "Campus Updates", href: "/campus-updates" },
    { label: "All Stories" }
  ];

  return (
    <div>
      <PageHeader
        badge="CAMPUS HIGHLIGHTS"
        title="Department News &"
        highlight="Campus Updates"
        description="Stay connected with hackathons, student milestones, placement drives, infrastructure upgrades, and academic activities at T.P. College Madhepura."
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
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  category === cat
                    ? 'bg-[#0B192C] text-amber-400 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'All Updates' : cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80">
            <SearchBar
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder="Search news, workshops, awards..."
            />
          </div>
        </div>

        {/* Content Listing */}
        {loading ? (
          <LoadingState message="Fetching campus updates..." count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : updates.length === 0 ? (
          <EmptyState
            title="No campus updates found"
            message={`No updates matched '${search || category}'. Try changing your search query or filter.`}
            actionText="Clear Filters"
            onAction={() => { setSearch(''); setCategory('All'); }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {updates.map((update) => (
              <CampusUpdateCard key={update.id} update={update} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
