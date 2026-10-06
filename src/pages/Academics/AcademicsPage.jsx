import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineAcademicCap, 
  HiOutlineBookOpen, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineArrowRight,
  HiOutlineDesktopComputer,
  HiOutlineCalendar,
  HiOutlineDocumentReport
} from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import SectionHeading from '../../components/common/SectionHeading';
import { useAcademics } from '../../hooks/useAcademics';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function AcademicsPage() {
  const { academics, loading, error } = useAcademics();

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <LoadingState message="Loading academic details..." />
      </div>
    );
  }

  if (error || !academics) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <ErrorState message={error || "Failed to load academic information."} />
      </div>
    );
  }

  const { programOverview, semestersStructure } = academics;

  const breadcrumbs = [
    { label: "Academics", href: "/academics" },
    { label: "BCA Program Overview" }
  ];

  const headerStats = [
    { label: "Duration", value: "3 Years" },
    { label: "Semesters", value: "6 Semesters" },
    { label: "Total Credits", value: "140+ Credits" },
    { label: "Approved Intake", value: "60 Seats" },
  ];

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        badge="ACADEMIC EXCELLENCE"
        title="Bachelor of Computer"
        highlight="Applications (BCA)"
        description="A full-time 3-year professional degree program under B.N. Mandal University, designed to equip students with comprehensive software development and algorithmic abilities."
        breadcrumbs={breadcrumbs}
        stats={headerStats}
      />

      {/* Quick Jump Subnav */}
      <div className="bg-slate-900 text-slate-300 py-3 px-4 border-b border-slate-800 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 text-xs font-semibold">
          <span className="text-amber-400 uppercase tracking-wider whitespace-nowrap">Academics Menu:</span>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Link to="/academics" className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold">
              BCA Overview
            </Link>
            <Link to="/academics/labs-structure" className="px-3 py-1 rounded-lg hover:bg-slate-800 text-slate-200">
              Labs & Course Structure
            </Link>
            <Link to="/academics/calendar" className="px-3 py-1 rounded-lg hover:bg-slate-800 text-slate-200">
              Academic Calendar
            </Link>
            <Link to="/academics/computing-labs" className="px-3 py-1 rounded-lg hover:bg-slate-800 text-slate-200">
              Computing Infrastructure
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Program Overview & Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="PROGRAM OVERVIEW"
              badgeVariant="wine"
              title="About the BCA Curriculum"
              subtitle={programOverview.overview}
            />

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Program Objectives:</h3>
              <div className="space-y-3">
                {programOverview.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card: Eligibility & Admission Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-navy-950 to-[#0B192C] text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ADMISSION CRITERIA
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-2">Eligibility & Intake</h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <strong className="text-white block mb-1">🎓 Educational Qualification:</strong>
                {programOverview.eligibility.qualification}
              </div>
              <div>
                <strong className="text-white block mb-1">📐 Subject Prerequisite:</strong>
                {programOverview.eligibility.subjectRequirement}
              </div>
              <div>
                <strong className="text-white block mb-1">📊 Minimum Marks:</strong>
                {programOverview.eligibility.minimumMarks}
              </div>
              <div>
                <strong className="text-white block mb-1">🎯 Selection Process:</strong>
                {programOverview.eligibility.selectionCriteria}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/contact#admission-inquiry"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Inquire for BCA Admission</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Semesters Curriculum High-Level Breakdown */}
        <section>
          <SectionHeading
            badge="SEMESTER BREAKDOWN"
            badgeVariant="gold"
            title="6-Semester Course Matrix"
            subtitle="Overview of all 6 semesters. Click any semester to explore detailed lab subjects, theory papers, and syllabus credit distribution."
            align="between"
            action={
              <Link
                to="/academics/labs-structure"
                className="text-xs sm:text-sm font-bold text-navy-900 hover:text-amber-600 inline-flex items-center gap-1"
              >
                <span>View Complete Labs & Syllabus</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {semestersStructure.map((sem) => (
              <div
                key={sem.semester}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                      Semester {sem.semester}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {sem.credits} Credits
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-3">
                    {sem.title}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    {sem.subjects.map((sub) => (
                      <div key={sub.code} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                        <span className="truncate pr-2 font-medium">{sub.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sub.type === 'Practical' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                          {sub.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/pyqs/semester-${sem.semester}`}
                    className="text-xs font-bold text-navy-900 hover:text-amber-600"
                  >
                    Semester {sem.semester} PYQs →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Pathways */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12">
          <SectionHeading
            badge="CAREER PROSPECTS"
            badgeVariant="gold"
            title="Where Can a BCA Degree Take You?"
            subtitle="Graduates from our department excel across diversified domains including software development, data analytics, cloud systems, and premier higher education."
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programOverview.careerPathways.map((career, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition-colors">
                <div className="text-amber-400 text-sm font-bold">{career.salary}</div>
                <h4 className="text-base font-extrabold text-white mt-1">{career.role}</h4>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
