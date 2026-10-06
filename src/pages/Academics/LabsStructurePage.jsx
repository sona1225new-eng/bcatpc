import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineDesktopComputer, 
  HiOutlineBookOpen, 
  HiOutlineCheck, 
  HiOutlineArrowRight,
  HiOutlineTerminal,
  HiOutlineDatabase,
  HiOutlineGlobeAlt
} from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import SectionHeading from '../../components/common/SectionHeading';
import { useAcademics } from '../../hooks/useAcademics';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function LabsStructurePage() {
  const { academics, loading, error } = useAcademics();
  const [selectedSemTab, setSelectedSemTab] = useState(1);

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <LoadingState message="Loading syllabus and laboratory curriculum..." />
      </div>
    );
  }

  if (error || !academics) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <ErrorState message={error || "Failed to load lab structure."} />
      </div>
    );
  }

  const { semestersStructure, labsDetails } = academics;
  const currentSemesterData = semestersStructure.find((s) => s.semester === selectedSemTab) || semestersStructure[0];

  const breadcrumbs = [
    { label: "Academics", href: "/academics" },
    { label: "BCA Labs & Structure" }
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        badge="CURRICULUM & PRACTICALS"
        title="BCA Labs & Course"
        highlight="Structure"
        description="Detailed semester-wise syllabus, theory papers, practical coding laboratories, credit allocations, and specialized computational lab configurations."
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Section 1: Detailed Semester Syllabus Selector */}
        <section>
          <SectionHeading
            badge="SEMESTER-WISE SYLLABUS"
            badgeVariant="wine"
            title="Syllabus & Subject Breakdown"
            subtitle="Select a semester to inspect course codes, theory vs practical distribution, examination marks, and credit weightage."
          />

          {/* Semester Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {semestersStructure.map((sem) => (
              <button
                key={sem.semester}
                type="button"
                onClick={() => setSelectedSemTab(sem.semester)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                  selectedSemTab === sem.semester
                    ? 'bg-[#0B192C] text-amber-400 shadow-lg border border-amber-500/40'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Semester {sem.semester} ({sem.credits} Credits)
              </button>
            ))}
          </div>

          {/* Active Semester Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Semester {currentSemesterData.semester} Details
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  {currentSemesterData.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-xl">
                  Total Credits: {currentSemesterData.credits}
                </span>
                <Link
                  to={`/pyqs/semester-${currentSemesterData.semester}`}
                  className="text-xs sm:text-sm font-bold px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition"
                >
                  Download PYQs →
                </Link>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Subject Code</th>
                    <th className="py-3.5 px-4">Subject Name</th>
                    <th className="py-3.5 px-4">Paper Type</th>
                    <th className="py-3.5 px-4">Max Marks</th>
                    <th className="py-3.5 px-4">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentSemesterData.subjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-900">{sub.code}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{sub.name}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sub.type === 'Practical'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : sub.type === 'Viva'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {sub.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{sub.marks}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-700">{sub.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2: Specialized Department Labs */}
        <section>
          <SectionHeading
            badge="PRACTICAL INFRASTRUCTURE"
            badgeVariant="gold"
            title="Department Computing Laboratories"
            subtitle="Hands-on software development environments equipped with dedicated compilers, DBMS servers, and AI workstations."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labsDetails.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-900 text-amber-400">
                      {lab.room}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {lab.capacity}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900">
                    {lab.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lab.description}
                  </p>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Software Stack:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.software.map((sw, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg">
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Lab Practicals:</h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {lab.keyPracticals.map((prac, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-amber-500">•</span>
                          <span>{prac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Faculty In-charge: <strong className="text-slate-800">{lab.inCharge}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
