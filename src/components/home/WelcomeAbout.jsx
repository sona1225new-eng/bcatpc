import React from 'react';
import { Link } from 'react-router-dom';
import { HiCheckCircle, HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import SectionHeading from '../common/SectionHeading';
import { siteConfig } from '../../config/siteConfig';

export default function WelcomeAbout() {
  const highlights = [
    "3-Year full-time professional undergraduate degree under B.N. Mandal University.",
    "Comprehensive programming languages: C, C++, Java, Python, and Full-Stack Web Technologies.",
    "Rigorous practical coding sessions with 100% hands-on laboratory learning experience.",
    "Continuous internal assessment, model papers, and university examination mentorship.",
    "State-of-the-art infrastructure: High-speed Wi-Fi and Intel Core i7 PC workstations.",
    "Seminars, industry expert guest lectures, and student-led BCA Coding Club hackathons.",
    "Comprehensive Question Bank (PYQ) repository for all 6 semesters from past university exams."
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Department Description & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 mb-3">
                WELCOME TO BCA T.P. COLLEGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                About the Department
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The Department of Computer Application at Thakur Prasad College (T.P. College), Madhepura, was established to foster technological competence and software engineering skills among aspiring students in northern and eastern Bihar. Affiliated as a premier constituent unit of B.N. Mandal University, our BCA curriculum balances strong theoretical foundations with intensive practical laboratory training in computer software and applications.
            </p>

            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-blue-900">
                Here are key highlights of the BCA program:
              </h4>

              <div className="space-y-3">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HiCheckCircle className="w-4 h-4 text-blue-700" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/academics"
                className="px-6 py-3 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md transition-all"
              >
                <span>Read Full BCA Syllabus & Details</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/faculties"
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition"
              >
                <span>Meet Our Faculty</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Campus & Lab Image Card matching reference */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=900&q=80"
                alt="T.P. College Madhepura Campus"
                className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Bottom Glass Overlay Card */}
              <div className="absolute bottom-5 inset-x-5 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950">
                    T.P. COLLEGE CAMPUS
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">• Madhepura</span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Academic Excellence & High-Tech Computing
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  NAAC Accredited Grade 'B' • Constituent Unit of BNMU
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
