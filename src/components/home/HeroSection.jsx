import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineBell } from 'react-icons/hi';
import { siteConfig } from '../../config/siteConfig';
import { useNotices } from '../../hooks/useNotices';

export default function HeroSection() {
  const { notices, loading, error } = useNotices({ limit: 3 });

  return (
    <section className="hero-section relative overflow-hidden text-white">
      <img
        src="/college-campus.png"
        alt=""
        className="hero-campus-image"
      />
      <div className="hero-image-overlay" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px] gap-10 xl:gap-16 items-center py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-sky-200">
              Education <span className="mx-2 text-white/40">|</span> Technology <span className="mx-2 text-white/40">|</span> Innovation
            </p>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.7rem] font-extrabold tracking-tight text-white leading-[1.08]">
              <span className="hero-heading-line">Welcome To</span>
              <span className="hero-heading-line">Department Of</span>
              <span className="hero-heading-line">Computer Application</span>
            </h1>

            <p className="mt-5 text-xl sm:text-2xl font-semibold tracking-tight text-white">
              {siteConfig.shortCollegeName}, Madhepura
            </p>

            <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl">
              Welcome to the Department of Computer Application, T.P. College Madhepura (B.N. Mandal University). Our BCA program provides students with a strong foundation in computer science, programming, networking, database technologies, and software engineering. We focus on hands-on practical lab experience, modern IT curriculum, and real-world projects to prepare you for high-growth software careers and premier master's programs.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/academics"
                className="px-6 sm:px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm tracking-wide inline-flex items-center gap-2 shadow-lg shadow-blue-950/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Explore BCA</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pyqs"
                className="px-6 sm:px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/50 hover:border-white font-bold text-sm inline-flex items-center gap-2 shadow-md transition-all duration-200"
              >
                <span>Browse PYQ</span>
              </Link>
            </div>
          </div>

          <aside className="w-full max-w-[430px] lg:max-w-none lg:justify-self-end bg-white text-slate-900 rounded-2xl shadow-2xl shadow-slate-950/40 ring-1 ring-white/50 p-5 sm:p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HiOutlineBell className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Latest Updates</h2>
            </div>

            {loading ? (
              <p className="py-5 text-sm text-slate-500" role="status">
                Loading latest updates…
              </p>
            ) : error ? (
              <p className="py-5 text-sm text-slate-500" role="status">
                Latest updates are temporarily unavailable.
              </p>
            ) : notices.length === 0 ? (
              <p className="py-5 text-sm text-slate-500">
                No current notices available.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <li key={notice.id}>
                    <Link
                      to={`/notices/${notice.id}`}
                      className="group block py-4 first:pt-4 last:pb-1"
                    >
                      <span className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-sm font-bold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                            {notice.title}
                          </span>
                          <span className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                            <span className="uppercase tracking-wide">{notice.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{notice.formattedDate || notice.date}</span>
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/notices"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>View All Notices</span>
              <HiOutlineArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
