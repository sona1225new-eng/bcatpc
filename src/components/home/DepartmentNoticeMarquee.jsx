import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineDownload,
} from 'react-icons/hi';

function NoticeTitle({ notice }) {
  const viewportRef = useRef(null);
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const text = textRef.current;
    if (!viewport || !text) return undefined;

    const updateOverflow = () => {
      setIsOverflowing(text.scrollWidth > viewport.clientWidth);
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(viewport);
    observer.observe(text);
    return () => observer.disconnect();
  }, [notice.title]);

  return (
    <div
      ref={viewportRef}
      className={`notice-title-marquee${isOverflowing ? ' is-overflowing' : ''}`}
    >
      <span className="notice-title-track">
        <span ref={textRef} className="notice-title-copy">
          <Link to={`/notices/${notice.id}`}>
            {notice.title}
          </Link>
        </span>
        {isOverflowing && (
          <span className="notice-title-copy" aria-hidden="true" inert>
            {notice.title}
          </span>
        )}
      </span>
    </div>
  );
}

function NoticeCard({ notice }) {
  return (
    <article className="department-notice-card group relative flex w-[280px] flex-shrink-0 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-gold-500/80 hover:shadow-md sm:w-[320px]">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-800">
          {notice.departmentCategory}
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-navy-900">
            {notice.category}
          </span>
          {notice.tag && (
            <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-xs font-bold text-navy-900">
              {notice.tag}
            </span>
          )}
          {notice.isNew && (
            <span className="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-slate-950">
              New
            </span>
          )}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
          {notice.highlight && (
            <span className="font-semibold text-navy-800">{notice.highlight}</span>
          )}
          <span className="inline-flex items-center gap-1">
            <HiOutlineCalendar className="h-3.5 w-3.5" />
            {notice.formattedDate || notice.date}
          </span>
          {notice.isUrgent && (
            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
              {notice.category === 'Examination' ? 'Form Open' : 'Urgent'}
            </span>
          )}
        </div>
        <NoticeTitle notice={notice} />
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
          {notice.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs font-semibold">
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

export default function DepartmentNoticeMarquee({ notices }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [rowPosition, setRowPosition] = useState({ offset: 0, maxOffset: 0, step: 344 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;

    const updateMeasurements = () => {
      const card = track.querySelector('.department-notice-card');
      const cardWidth = card?.getBoundingClientRect().width ?? 320;
      const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setRowPosition((current) => ({
        offset: Math.min(current.offset, maxOffset),
        maxOffset,
        step: cardWidth + 24,
      }));
    };

    updateMeasurements();
    const observer = new ResizeObserver(updateMeasurements);
    observer.observe(viewport);
    observer.observe(track);

    return () => {
      observer.disconnect();
    };
  }, [notices.length]);

  const shiftCards = (direction) => {
    setRowPosition((current) => ({
      ...current,
      offset: Math.max(0, Math.min(current.maxOffset, current.offset + direction * current.step)),
    }));
  };

  if (notices.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
        No department notices are available right now.
      </p>
    );
  }

  return (
    <div className="flex min-w-0 max-w-full items-center gap-2">
      <button
        type="button"
        onClick={() => shiftCards(-1)}
        disabled={rowPosition.offset <= 0}
        aria-label="Scroll notices left"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 shadow-sm transition hover:border-gold-500 hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={viewportRef}
        className="department-notice-viewport min-w-0 flex-1"
        aria-label="Department notices"
      >
        <div
          ref={trackRef}
          className="department-notice-track flex w-max flex-nowrap items-stretch gap-6"
          style={{ transform: `translateX(-${rowPosition.offset}px)` }}
        >
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => shiftCards(1)}
        disabled={rowPosition.offset >= rowPosition.maxOffset}
        aria-label="Scroll notices right"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 shadow-sm transition hover:border-gold-500 hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
