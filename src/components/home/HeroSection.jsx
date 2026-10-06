import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineDocumentDownload, HiOutlineSparkles } from 'react-icons/hi';
import InfoCard from '../cards/InfoCard';
import { siteConfig } from '../../config/siteConfig';

export default function HeroSection() {
  return (
    <section className="relative bg-[#0B192C] text-white pt-12 pb-20 md:py-24 overflow-hidden border-b border-slate-800">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, intro & action buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Admission Open Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs font-bold tracking-wide shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-extrabold uppercase tracking-wider text-rose-300">
                🎓 ADMISSION OPEN {siteConfig.admissions.session}
              </span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Welcome To Department Of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 drop-shadow-sm">
                Computer Application
              </span>
            </h1>

            {/* Intro Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              Welcome to the Department of Computer Application, T.P. College Madhepura (B.N. Mandal University). Our BCA program provides students with a strong foundation in computer science, programming, networking, database technologies, and software engineering. We focus on hands-on practical lab experience, modern IT curriculum, and real-world projects to prepare you for high-growth software careers and premier master's programs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/academics"
                className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-800 text-white font-extrabold text-xs sm:text-sm tracking-wide inline-flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>EXPLORE BCA</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pyqs"
                className="px-6 sm:px-7 py-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-amber-400/80 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all duration-200"
              >
                <span className="text-amber-400">⚡</span>
                <span>Browse PYQ</span>
              </Link>

              <Link
                to="/contact#admission-inquiry"
                className="px-5 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-md shadow-amber-900/20 transition-all duration-200"
              >
                <span>Apply Online</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Department key stats row */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{siteConfig.stats.programYears} Years</div>
                <div className="text-xs text-slate-400">Degree Program</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{siteConfig.stats.semesters} Sem</div>
                <div className="text-xs text-slate-400">CBCS Syllabus</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{siteConfig.stats.labSystems} PCs</div>
                <div className="text-xs text-slate-400">Coding Labs</div>
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
              badgeVariant="blue"
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
