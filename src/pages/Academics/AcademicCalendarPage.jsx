import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineTag, 
  HiOutlineDownload, 
  HiOutlineCheckCircle,
  HiOutlineArrowRight
} from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import SectionHeading from '../../components/common/SectionHeading';
import { useAcademics } from '../../hooks/useAcademics';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function AcademicCalendarPage() {
  const { academics, loading, error } = useAcademics();
  const [filterType, setFilterType] = useState('All');

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <LoadingState message="Loading academic schedule and calendar..." />
      </div>
    );
  }

  if (error || !academics) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <ErrorState message={error || "Failed to load academic calendar."} />
      </div>
    );
  }

  const { academicCalendar } = academics;

  const breadcrumbs = [
    { label: "Academics", href: "/academics" },
    { label: "Academic Calendar" }
  ];

  const types = ['All', 'Academic', 'Examination', 'University Exam', 'Holiday', 'Event'];

  return (
    <div>
      <PageHeader
        badge="ANNUAL SCHEDULE"
        title="Department Academic"
        highlight="Calendar"
        description={`Official schedule for Academic Session ${academicCalendar.currentSession}. Includes admission timelines, continuous internal assessments, BNMU university examination windows, and holidays.`}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Filter by Activity Type</span>
            <div className="flex flex-wrap items-center gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterType === type
                      ? 'bg-navy-900 text-amber-400 shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={() => alert("Downloading Official Academic Calendar 2026-27 (PDF)")}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition"
            >
              <HiOutlineDownload className="w-4 h-4 text-amber-400" />
              <span>Download Official Calendar (PDF)</span>
            </button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-8">
          {academicCalendar.timeline.map((block, idx) => {
            const filteredEvents = filterType === 'All'
              ? block.events
              : block.events.filter((e) => e.type.toLowerCase().includes(filterType.toLowerCase()));

            if (filteredEvents.length === 0) return null;

            return (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-amber-400">
                    <HiOutlineCalendar className="w-5 h-5 text-amber-400" />
                    <span>{block.month}</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Session {academicCalendar.currentSession}
                  </span>
                </div>

                <div className="p-6 divide-y divide-slate-100 space-y-4">
                  {filteredEvents.map((evt, eIdx) => (
                    <div key={eIdx} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            evt.type.includes('Exam')
                              ? 'bg-rose-100 text-rose-800'
                              : evt.type.includes('Holiday')
                              ? 'bg-amber-100 text-amber-800'
                              : evt.type.includes('Admission')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {evt.type}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            evt.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700 font-bold'
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {evt.title}
                        </h4>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-navy-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 sm:text-right flex-shrink-0">
                        {evt.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
