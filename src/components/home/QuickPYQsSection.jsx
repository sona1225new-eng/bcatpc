import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSearch } from 'react-icons/hi';
import { usePYQs } from '../../hooks/usePYQs';
import { semestersList } from '../../data/pyqs';
import PYQCard from '../cards/PYQCard';
import SectionHeading from '../common/SectionHeading';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';

export default function QuickPYQsSection() {
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  const { pyqs, loading, error, refetch } = usePYQs({
    semester: selectedSemester,
    search: searchQuery,
    year: selectedYear,
    limit: 4,
  });

  const years = ["all", "2024", "2023", "2022", "2021", "2020", "2019"];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Search and Year Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 mb-2.5">
              ACADEMIC RESOURCE HUB
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Previous Year Papers & Question Bank
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Access authentic university examination papers, mid-term tests, and model questions across all 6 semesters.
            </p>
          </div>

          {/* Search & Filter controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or code..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50"
              />
            </div>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              <option value="all">All Years (2019-2024)</option>
              {years.filter(y => y !== 'all').map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Semester Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            type="button"
            onClick={() => setSelectedSemester('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedSemester === 'all'
                ? 'bg-[#0B192C] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Semesters
          </button>
          {semestersList.map((sem) => (
            <button
              key={sem.id}
              type="button"
              onClick={() => setSelectedSemester(sem.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedSemester === sem.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sem.name}
            </button>
          ))}
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <LoadingState message="Fetching question papers..." count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : pyqs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-600">No question papers match your filter criteria.</p>
            <button
              onClick={() => { setSelectedSemester('all'); setSearchQuery(''); setSelectedYear('all'); }}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pyqs.map((paper) => (
              <PYQCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

        {/* Large Bottom Action Banner matching reference */}
        <div className="mt-12 text-center">
          <Link
            to="/pyqs"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#0B192C] hover:bg-slate-900 text-white font-extrabold text-sm sm:text-base shadow-xl border border-slate-700 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-amber-400 text-lg">⚡</span>
            <span>Open Full Question Repository (2019-2024)</span>
            <HiOutlineArrowRight className="w-5 h-5 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
