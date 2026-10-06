import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineBookOpen, 
  HiOutlineDownload, 
  HiOutlineSearch, 
  HiOutlineArrowRight,
  HiOutlineDocumentText,
  HiOutlineSparkles
} from 'react-icons/hi';
import { usePYQs } from '../../hooks/usePYQs';
import { semestersList } from '../../data/pyqs';
import PYQCard from '../../components/cards/PYQCard';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function PYQsHubPage() {
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [search, setSearch] = useState('');

  const { pyqs, loading, error, refetch } = usePYQs({
    semester: selectedSemester,
    year: selectedYear,
    search: search,
  });

  const years = ["all", "2024", "2023", "2022", "2021", "2020", "2019"];

  const breadcrumbs = [
    { label: "PYQs", href: "/pyqs" },
    { label: "Question Papers Hub" }
  ];

  const headerStats = [
    { label: "Total Semesters", value: "6 Semesters" },
    { label: "Years Archive", value: "2019 - 2024" },
    { label: "Subjects Covered", value: "30+ Subjects" },
    { label: "Format", value: "Verified PDF" },
  ];

  return (
    <div>
      <PageHeader
        badge="ACADEMIC RESOURCE ARCHIVE"
        title="Previous Year Question Papers"
        highlight="(PYQs)"
        description="Download authentic B.N. Mandal University term-end examination question papers, internal mid-semester tests, and solution model sets across Semesters 1 through 6."
        breadcrumbs={breadcrumbs}
        stats={headerStats}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Six Semester Quick Cards Hub */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">Explore by Semester</h3>
              <p className="text-xs sm:text-sm text-slate-500">Select any semester to access subject-specific question paper archives.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {semestersList.map((sem) => (
              <Link
                key={sem.id}
                to={`/pyqs/${sem.id}`}
                className="group bg-white rounded-2xl p-4 border border-slate-200 hover:border-amber-400 hover:bg-[#0B192C] text-slate-800 hover:text-white shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center justify-between space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-500 text-amber-700 group-hover:text-slate-950 flex items-center justify-center font-black text-xs transition-colors">
                  {sem.code}
                </div>
                <div>
                  <div className="font-extrabold text-sm">{sem.name}</div>
                  <div className="text-[11px] text-slate-400 group-hover:text-slate-300 font-medium">{sem.roman}</div>
                </div>
                <div className="text-[11px] text-amber-600 group-hover:text-amber-400 font-bold flex items-center gap-1">
                  <span>Browse</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Global Filter Bar */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Search & Filter Question Bank</h3>
              <p className="text-xs text-slate-500">Filter by semester, university exam year, or subject keywords.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-semibold text-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Years (2019-2024)</option>
                {years.filter(y => y !== 'all').map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>

              {/* Search */}
              <div className="w-full sm:w-64">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search subject, C++, Java, DBMS..."
                />
              </div>
            </div>
          </div>

          {/* Semester Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedSemester('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedSemester === 'all'
                  ? 'bg-navy-900 text-amber-400 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Semesters
            </button>
            {semestersList.map((sem) => (
              <button
                key={sem.id}
                type="button"
                onClick={() => setSelectedSemester(sem.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedSemester === sem.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {sem.name}
              </button>
            ))}
          </div>
        </section>

        {/* Papers Grid */}
        {loading ? (
          <LoadingState message="Loading question papers..." count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : pyqs.length === 0 ? (
          <EmptyState
            title="No question papers found"
            message={`No PYQs matched your criteria (Semester: ${selectedSemester}, Year: ${selectedYear}, Search: '${search}').`}
            actionText="Clear All Filters"
            onAction={() => { setSelectedSemester('all'); setSelectedYear('all'); setSearch(''); }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pyqs.map((paper) => (
              <PYQCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
