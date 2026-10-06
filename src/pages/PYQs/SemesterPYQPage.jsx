import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineBookOpen, 
  HiOutlineDownload, 
  HiOutlineSearch,
  HiOutlineSparkles
} from 'react-icons/hi';
import { useSemesterPYQs } from '../../hooks/usePYQs';
import { semestersList } from '../../data/pyqs';
import PYQCard from '../../components/cards/PYQCard';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function SemesterPYQPage() {
  const { semesterId } = useParams();
  const { semester, papers, loading, error } = useSemesterPYQs(semesterId);

  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  const filteredPapers = papers.filter((paper) => {
    const matchesYear = selectedYear === 'all' || String(paper.year) === String(selectedYear);
    const matchesSearch = !search.trim() || 
      paper.subject.toLowerCase().includes(search.toLowerCase()) ||
      paper.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      (paper.topicsCovered && paper.topicsCovered.some(t => t.toLowerCase().includes(search.toLowerCase())));
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
                    ? 'bg-[#0B192C] text-amber-400'
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Year:</span>
            {['all', '2024', '2023', '2022', '2021'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedYear === yr
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {yr === 'all' ? 'All' : yr}
              </button>
            ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <PYQCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
