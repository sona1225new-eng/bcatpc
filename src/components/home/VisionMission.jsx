import React from 'react';
import { HiOutlineEye, HiOutlineFlag, HiOutlineSparkles, HiOutlineAcademicCap, HiOutlineLightningBolt } from 'react-icons/hi';
import SectionHeading from '../common/SectionHeading';

export default function VisionMission() {
  return (
    <section className="py-20 md:py-28 bg-[#070D18] text-white relative overflow-hidden border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Starry dot texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="OUR GUIDING PRINCIPLES"
          badgeVariant="gold"
          title="Vision & Mission"
          subtitle="Fostering academic distinction, innovation in software development, and ethical leadership in computing."
          align="center"
          light
        />

        {/* 2 Big Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: Our Vision */}
          <div className="group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/50 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <HiOutlineEye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Our Vision
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold">Strategic Departmental Objective</span>
                </div>
              </div>

              {/* Italicized Quote */}
              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 italic leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
                "To be a premier educational institution recognized for outcome-based technical education, hands-on coding mastery, and application-oriented software research in the state of Bihar."
              </blockquote>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We aspire to empower every BCA graduate with cutting-edge analytical, algorithmic, and engineering skills to bridge rural talent with global IT industry opportunities.
              </p>
            </div>

            {/* Bottom Tag */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span>★</span>
              <span>EXCELLENCE IN TECHNICAL EDUCATION</span>
            </div>
          </div>

          {/* Card 2: Our Mission */}
          <div className="group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-rose-500/50 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                  <HiOutlineFlag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Our Mission
                  </h3>
                  <span className="text-xs text-rose-400 font-semibold">Our Core Purpose & Commitments</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  To impart comprehensive, industry-aligned undergraduate computer science education combining rigorous theory with extensive laboratory programming practice.
                </p>
                <p>
                  To nurture critical problem-solving skills, collaborative coding habits, and ethical consciousness through continuous hackathons, seminars, and capstone software development.
                </p>
                <p>
                  To provide dedicated career mentorship enabling students to qualify for top national MCA entrance exams and secure roles in premier IT enterprises.
                </p>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <span>★</span>
              <span>STUDENT-CENTRIC HOLISTIC GROWTH</span>
            </div>
          </div>

        </div>

        {/* 3 Bottom Feature Pills / Widgets matching reference */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <HiOutlineAcademicCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Visionary Education Approach</h4>
              <p className="text-xs text-slate-400 mt-0.5">Modern CBCS syllabus, outcome-based pedagogy, and university exam preparation.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <HiOutlineLightningBolt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Skill Enrichment</h4>
              <p className="text-xs text-slate-400 mt-0.5">Weekly coding labs, MERN bootcamps, and competitive hackathons.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/90 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Empowered Graduates</h4>
              <p className="text-xs text-slate-400 mt-0.5">1500+ successful alumni in top tech companies and higher academia.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
