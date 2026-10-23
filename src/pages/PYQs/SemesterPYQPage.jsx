import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useSemesterPYQs } from '../../hooks/usePYQs';
import { semestersList } from '../../data/pyqs';
import PYQCard from '../../components/cards/PYQCard';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function SemesterPYQPage({ semesterId }) {
  const { semester, papers, loading, error } = useSemesterPYQs(semesterId);

  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  const years = [...new Set(papers.map((paper) => String(paper.year)).filter(Boolean))]
    .sort((a, b) => Number(b) - Number(a));
  const filteredPapers = papers.filter((paper) => {
    const matchesYear = selectedYear === 'all' || String(paper.year) === String(selectedYear);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query ||
      [paper.title, paper.subject, paper.subjectCode]
        .some((value) => value?.toLowerCase().includes(query)) ||
      (paper.topicsCovered || []).some((topic) => topic.toLowerCase().includes(query));
    return matchesYear && matchesSearch;
  });

  const semInfo = semester || semestersList.find(s => s.id === semesterId) || { name: semesterId, roman: semesterId };

  const breadcrumbs = [
    { label: "PYQs Hub", href: "/pyqs" },
    { label: semInfo.name }
  ];

  return (
    <div>
      <PageHeader
        badge={semInfo.code || "SEMESTER ARCHIVE"}
        title={semInfo.name}
        highlight="Question Papers"
        description={`Download subject-wise previous year questions, semester final papers, and internal assessment sets for ${semInfo.name} (${semInfo.roman}).`}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        {/* Navigation bar between semesters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <Link
            to="/pyqs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to All Semesters</span>
          </Link>

          {/* Quick jump to another semester */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {semestersList.map((s) => (
              <Link
                key={s.id}
                to={`/pyqs/${s.id}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  s.id === semesterId
                    ? 'bg-[#233B5D] text-amber-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.roman}
              </Link>
            ))}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="semester-year-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter Year:
            </label>
            <select
              id="semester-year-filter"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Years</option>
              {selectedYear !== 'all' && !years.includes(selectedYear) && (
                <option value={selectedYear}>Year {selectedYear}</option>
              )}
              {years.map((year) => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={`Search in ${semInfo.name}...`}
            />
          </div>
        </div>

        {/* Papers Listing */}
        {loading ? (
          <LoadingState message={`Fetching ${semInfo.name} question papers...`} count={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredPapers.length === 0 ? (
          <EmptyState
            title={`No question papers found for ${semInfo.name}`}
            message="Try resetting your search query or selecting a different year."
            actionText="Reset Filters"
            onAction={() => { setSelectedYear('all'); setSearch(''); }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPapers.map((paper) => (
              <PYQCard key={paper._id || paper.id} paper={paper} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
