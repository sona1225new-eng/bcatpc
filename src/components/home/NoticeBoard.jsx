import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineDocumentText, 
  HiOutlineClipboardList, 
  HiOutlineSparkles, 
  HiOutlineArrowRight, 
  HiOutlineCalendar,
  HiOutlineDownload
} from 'react-icons/hi';
import { useNotices } from '../../hooks/useNotices';
import SectionHeading from '../common/SectionHeading';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';

export default function NoticeBoard() {
  const { notices, loading, error, refetch } = useNotices();

  if (loading) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingState message="Loading latest department notices..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={refetch} />
      </section>
    );
  }

  // Filter dynamic categories from the service data
  const officialNotices = notices.filter(
    (n) => n.category === "Official" || n.category === "Admission" || n.tag?.includes("Official")
  );
  const examNotices = notices.filter(
    (n) => n.category === "Examination" || n.tag?.includes("Exam")
  );
  const campusEvents = notices.filter(
    (n) => n.category === "Campus Life" || n.category === "Department" || n.tag?.includes("Events")
  );

  return (
    <section className="py-16 md:py-20 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="DEPARTMENT NOTICES"
          badgeVariant="wine"
          title="Important Notice Board"
          subtitle="Stay updated with official announcements, examination schedules, circulars, and departmental updates."
          align="between"
        />

        {/* 3 Columns Notice Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Official Circular / Notice */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-gold-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ivory text-navy-800 flex items-center justify-center">
                    <HiOutlineDocumentText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Official Circular / Notice
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-ivory text-navy-900 border border-slate-200">
                  Notice
                </span>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-3.5 divide-y divide-slate-100">
                {officialNotices.slice(0, 2).map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 group">
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      <span>{item.formattedDate || item.date}</span>
                      {item.isUrgent && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/notices/${item.id}`}
                      className="text-sm font-bold text-slate-800 group-hover:text-navy-800 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/notices?category=Admission"
                className="text-xs font-bold text-navy-900 hover:text-navy-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>VIEW ALL CIRCULARS</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Examinations / Exam Updates */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-gold-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-navy-800 flex items-center justify-center">
                    <HiOutlineClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Examinations / Exam Updates
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-navy-900 border border-slate-200">
                  Updates
                </span>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-3.5 divide-y divide-slate-100">
                {examNotices.slice(0, 2).map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 group">
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      <span>{item.formattedDate || item.date}</span>
                      {item.isUrgent && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Form Open
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/notices/${item.id}`}
                      className="text-sm font-bold text-slate-800 group-hover:text-navy-800 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/notices?category=Examination"
                className="text-xs font-bold text-navy-900 hover:text-navy-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>ALL EXAM NOTICES</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Campus Life / News & Events */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-gold-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-navy-800 flex items-center justify-center">
                    <HiOutlineSparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Campus Life / News & Events
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500/15 text-navy-900 border border-gold-500/30">
                  Upcoming
                </span>
              </div>

              {/* Highlight Box inside Card 3 */}
              <div className="mt-4 space-y-3.5">
                {campusEvents.slice(0, 1).map((event) => (
                  <div key={event.id} className="bg-ivory rounded-xl p-4 border border-slate-200 group">
                      <div className="flex items-center gap-2 text-xs text-navy-800 font-semibold mb-1">
                      <span>🏆 Flagship Hackathon</span>
                      <span>•</span>
                      <span>{event.formattedDate || event.date}</span>
                    </div>
                    <Link
                      to={`/notices/${event.id}`}
                      className="text-sm font-bold text-slate-900 group-hover:text-navy-800 transition-colors line-clamp-2"
                    >
                      {event.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                ))}
                
                {campusEvents.slice(1, 2).map((item) => (
                  <div key={item.id} className="pt-2 group">
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      <span>{item.formattedDate || item.date}</span>
                    </div>
                    <Link
                      to={`/notices/${item.id}`}
                      className="text-sm font-bold text-slate-800 group-hover:text-navy-800 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/campus-updates"
                className="text-xs font-bold text-navy-900 hover:text-navy-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>MORE EVENTS & NEWS</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
