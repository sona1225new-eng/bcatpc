import React from 'react';
import { useNotices } from '../../hooks/useNotices';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import DepartmentNoticeMarquee from './DepartmentNoticeMarquee';

const noticeCategories = [
  'Official Circular / Notice',
  'Examinations / Exam Updates',
  'Campus Life / News & Events',
  'Department Updates',
];

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

  const categorizedNotices = notices.map((notice) => {
    const departmentCategory =
      notice.category === 'Examination' || notice.tag?.includes('Exam')
        ? 'Examinations / Exam Updates'
        : notice.category === 'Campus Life' || notice.tag?.includes('Events')
          ? 'Campus Life / News & Events'
          : notice.category === 'Official' ||
              notice.category === 'Admission' ||
              notice.tag?.includes('Official')
            ? 'Official Circular / Notice'
            : 'Department Updates';

    return { ...notice, departmentCategory };
  });

  const noticeColumns = noticeCategories.map((category) => ({
    category,
    notices: categorizedNotices.filter((notice) => notice.departmentCategory === category),
  }));

  return (
    <section className="py-16 md:py-20 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
          Important Notice Board
        </h2>
        <DepartmentNoticeMarquee columns={noticeColumns} />
      </div>
    </section>
  );
}
