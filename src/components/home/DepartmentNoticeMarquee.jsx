import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineDownload,
} from 'react-icons/hi';

const DESCRIPTION_LIMIT = 160;

function NoticeEntry({ notice }) {
  const [expanded, setExpanded] = useState(false);
  const description = notice.description || '';
  const isLong = description.length > DESCRIPTION_LIMIT;
  const visibleDescription = expanded || !isLong
    ? description
    : `${description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`;

  return (
    <article className="border-b border-dotted border-sky-200 px-1 py-4 last:border-b-0">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-navy-900">
          {notice.category}
        </span>
        {notice.tag && (
          <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-xs font-semibold text-navy-900">
            {notice.tag}
          </span>
        )}
        {notice.isNew && (
          <span className="inline-flex items-center rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-navy-900">
            New
          </span>
        )}
      </div>

      <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted">
        <HiOutlineCalendar className="h-3.5 w-3.5" />
        {notice.formattedDate || notice.date}
      </p>

      <h3 className="text-sm font-bold leading-snug text-navy-900">
        <Link to={`/notices/${notice.id}`} className="hover:text-navy-800 hover:underline">
          {notice.title}
        </Link>
      </h3>

      {notice.isUrgent && (
        <span className="mt-2 inline-block rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-navy-800">
          {notice.category === 'Examination' ? 'Form Open' : 'Urgent'}
        </span>
      )}

      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {visibleDescription}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="mt-1 text-xs font-semibold text-navy-800 hover:underline"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold">
        <Link
          to={`/notices/${notice.id}`}
          className="inline-flex items-center gap-1 text-navy-800 hover:text-navy-900 hover:underline"
        >
          <span>Read Details</span>
          <HiOutlineArrowRight className="h-3.5 w-3.5" />
        </Link>
        {notice.documentUrl && (
          <a
            href={notice.documentUrl}
            className="inline-flex items-center gap-1 text-muted hover:text-navy-800"
            title="Download Attached Circular PDF"
            onClick={(event) => {
              if (notice.documentUrl.startsWith('#')) {
                event.preventDefault();
                alert(`Downloading: ${notice.documentName || 'Notice.pdf'}`);
              }
            }}
          >
            <HiOutlineDownload className="h-4 w-4 text-gold-500" />
            <span className="text-[11px] font-normal">{notice.documentSize || 'PDF'}</span>
          </a>
        )}
      </div>
    </article>
  );
}

function NoticeColumn({ category, notices }) {
  const viewportRef = useRef(null);
  const sequenceRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(1);
  const [sequenceHeight, setSequenceHeight] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const sequence = sequenceRef.current;
    if (!viewport || !sequence || notices.length === 0) return undefined;

    const measure = () => {
      const renderedHeight = sequence.getBoundingClientRect().height;
      const naturalHeight = renderedHeight / repeatCount;
      const viewportHeight = viewport.clientHeight;
      if (!naturalHeight || !viewportHeight) return;

      const nextRepeatCount = Math.max(1, Math.ceil(viewportHeight / naturalHeight));
      setSequenceHeight(naturalHeight);
      setRepeatCount((current) => (
        current === nextRepeatCount ? current : nextRepeatCount
      ));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(sequence);
    return () => observer.disconnect();
  }, [notices, repeatCount]);

  const shouldScroll = notices.length > 0 && sequenceHeight > 0;
  const duration = Math.max(18, Math.round(sequenceHeight / 18));

  return (
    <article
      tabIndex={0}
      className="department-notice-card flex h-[28rem] min-w-0 flex-col overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      <div className="flex min-h-[4.5rem] items-center border-b border-dotted border-sky-200 px-4 py-3">
        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold leading-relaxed text-navy-900">
          {category}
        </span>
      </div>

      {notices.length === 0 ? (
        <p className="flex flex-1 items-center justify-center px-4 text-center text-sm text-slate-500">
          No notices available.
        </p>
      ) : (
        <div
          ref={viewportRef}
          className={`notice-board-viewport min-h-0 flex-1 px-4 ${
            shouldScroll ? 'notice-board-scrolling' : ''
          }`}
          style={{ '--notice-board-duration': `${duration}s` }}
          aria-label={`${category} notices`}
        >
          <div className="notice-board-track">
            {[0, 1].map((loopIndex) => (
              <div
                key={loopIndex}
                ref={loopIndex === 0 ? sequenceRef : null}
                className="notice-board-sequence"
                aria-hidden={loopIndex === 1}
                inert={loopIndex === 1}
              >
                {Array.from({ length: repeatCount }, (_, repeatIndex) => (
                  <div
                    key={`${loopIndex}-${repeatIndex}`}
                    className={repeatIndex > 0 ? 'notice-board-repeat' : undefined}
                    aria-hidden={repeatIndex > 0 || loopIndex === 1}
                    inert={repeatIndex > 0 || loopIndex === 1}
                  >
                    {notices.map((notice) => (
                      <NoticeEntry key={`${notice.id}-${repeatIndex}`} notice={notice} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default function DepartmentNoticeMarquee({ columns }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <NoticeColumn
            key={column.category}
            category={column.category}
            notices={column.notices}
          />
        ))}
      </div>
    </div>
  );
}
