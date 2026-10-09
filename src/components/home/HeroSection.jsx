import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineDocumentDownload, HiOutlineSparkles } from 'react-icons/hi';
import InfoCard from '../cards/InfoCard';
import { siteConfig } from '../../config/siteConfig';

export default function HeroSection() {
  return (
    <section className="relative bg-[#F7F6F2] text-slate-900 pt-12 pb-20 md:py-24 overflow-hidden border-b border-slate-200">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-navy-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, intro & action buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Admission Open Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-navy-900 text-xs font-bold tracking-wide shadow-inner">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping"></span>
              <span className="font-extrabold uppercase tracking-wider text-navy-900">
                🎓 ADMISSION OPEN {siteConfig.admissions.session}
              </span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-balance text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Welcome To Department Of <br className="hidden sm:block" />
              <span className="text-navy-900">
                Computer Application
              </span>
            </h1>

            {/* Intro Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed font-normal max-w-2xl">
              Welcome to the Department of Computer Application, T.P. College Madhepura (B.N. Mandal University). Our BCA program provides students with a strong foundation in computer science, programming, networking, database technologies, and software engineering. We focus on hands-on practical lab experience, modern IT curriculum, and real-world projects to prepare you for high-growth software careers and premier master's programs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/academics"
                className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-800 text-white font-extrabold text-xs sm:text-sm tracking-wide inline-flex items-center gap-2 shadow-lg shadow-navy-900/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>EXPLORE BCA</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pyqs"
                className="px-6 sm:px-7 py-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-gold-400/80 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all duration-200"
              >
                <span className="text-gold-400">⚡</span>
                <span>Browse PYQ</span>
              </Link>

              <Link
                to="/contact#admission-inquiry"
                className="px-5 py-3.5 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-black text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-md shadow-navy-900/20 transition-all duration-200"
              >
                <span>Apply Online</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Department key stats row */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-navy-900">{siteConfig.stats.programYears} Years</div>
                <div className="text-xs text-muted">Degree Program</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-navy-900">{siteConfig.stats.semesters} Sem</div>
                <div className="text-xs text-muted">CBCS Syllabus</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-navy-900">{siteConfig.stats.labSystems} PCs</div>
                <div className="text-xs text-muted">Coding Labs</div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Sleek Info Highlights matching reference screenshot */}
          <div className="lg:col-span-5 space-y-3.5">
            <InfoCard
              icon="academic"
              title="3-Year Program"
              subtitle="Full-time Undergraduate BCA Degree"
              badgeText="Full-Time"
              badgeVariant="gold"
            />

            <InfoCard
              icon="book"
              title="6 Semesters"
              subtitle="Comprehensive CBCS Curriculum"
              badgeText="140+ Credits"
              badgeVariant="wine"
            />

            <InfoCard
              icon="briefcase"
              title="Top IT Recruiters"
              subtitle="Software & IT Career Pathways"
              badgeText="Tech Roles"
              badgeVariant="gold"
            />

            <InfoCard
              icon="computer"
              title="Hands-on Coding Labs"
              subtitle="Modern Intel Core i7 PC Workstations"
              badgeText="High-Speed"
              badgeVariant="gold"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
