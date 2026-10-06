import React, { useState } from 'react';
import { useFaculties } from '../../hooks/useFaculties';
import FacultyCard from '../../components/cards/FacultyCard';
import PageHeader from '../../components/common/PageHeader';
import SectionHeading from '../../components/common/SectionHeading';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import SearchBar from '../../components/common/SearchBar';

export default function FacultiesPage() {
  const { faculties, loading, error } = useFaculties();
  const [search, setSearch] = useState('');

  const breadcrumbs = [
    { label: "Faculties", href: "/faculties" },
    { label: "Faculty Directory" }
  ];

  const filteredFaculties = faculties.filter((f) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q) ||
      (f.teachingAreas && f.teachingAreas.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div>
      <PageHeader
        badge="ACADEMIC MENTORSHIP"
        title="Our Distinguished"
        highlight="Faculty Members"
        description="Meet the experienced academicians, researchers, and technical mentors leading the Department of Computer Application at T.P. College Madhepura."
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Department Faculty Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing {filteredFaculties.length} faculty members</p>
          </div>

          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search faculty by name, tech..."
            />
          </div>
        </div>

        {/* Faculties Grid */}
        {loading ? (
          <LoadingState message="Loading faculty directory..." count={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredFaculties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-600 font-semibold">No faculty found matching "{search}"</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-xs font-bold text-amber-700 underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredFaculties.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
