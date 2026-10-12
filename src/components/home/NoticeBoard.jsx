import React from 'react';
import { useNotices } from '../../hooks/useNotices';
import SectionHeading from '../common/SectionHeading';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import DepartmentNoticeMarquee from './DepartmentNoticeMarquee';

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
  const marqueeNotices = Array.from(new Map([
    ...officialNotices.slice(0, 2),
    ...examNotices.slice(0, 2),
    ...campusEvents.slice(0, 2),
  ].map((notice) => [notice.id, notice])).values()).map((notice) => ({
    ...notice,
    departmentCategory:
      notice.category === "Examination" || notice.tag?.includes("Exam")
        ? "Examinations / Exam Updates"
        : notice.category === "Campus Life" || notice.category === "Department" || notice.tag?.includes("Events")
          ? "Campus Life / News & Events"
          : "Official Circular / Notice",
    highlight: campusEvents[0]?.id === notice.id ? "🏆 Flagship Hackathon" : null,
  }));
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

        <DepartmentNoticeMarquee notices={marqueeNotices} />
      </div>
    </section>
  );
}
