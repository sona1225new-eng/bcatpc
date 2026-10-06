import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineDesktopComputer, 
  HiOutlineWifi, 
  HiOutlineServer, 
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineExclamation,
  HiOutlineArrowRight
} from 'react-icons/hi';
import PageHeader from '../../components/common/PageHeader';
import SectionHeading from '../../components/common/SectionHeading';
import { useAcademics } from '../../hooks/useAcademics';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function ComputingLabsPage() {
  const { academics, loading, error } = useAcademics();

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <LoadingState message="Loading computing infrastructure details..." />
      </div>
    );
  }

  if (error || !academics) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <ErrorState message={error || "Failed to load computing labs data."} />
      </div>
    );
  }

  const { infrastructure } = academics;

  const breadcrumbs = [
    { label: "Academics", href: "/academics" },
    { label: "Computing Labs & Infrastructure" }
  ];

  return (
    <div>
      <PageHeader
        badge="HIGH-TECH FACILITIES"
        title="Computing Labs &"
        highlight="Infrastructure"
        description="State-of-the-art software laboratories, dedicated high-speed optical fiber backbone, dual operating system workstations, and smart interactive theatres."
        breadcrumbs={breadcrumbs}
        stats={infrastructure.stats}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Core Infrastructure Pillars */}
        <section>
          <SectionHeading
            badge="HARDWARE & NETWORKING"
            badgeVariant="wine"
            title="Computational Capabilities"
            subtitle="Engineered to provide seamless, hands-on programming and experimental environments for over 180+ enrolled undergraduate students."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infrastructure.highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center font-bold">
                  <HiOutlineDesktopComputer className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lab Rules & Best Practices */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <HiOutlineExclamation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Laboratory Code of Conduct & Rules
              </h3>
              <p className="text-xs text-slate-400">Mandatory compliance for all regular and visiting students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
            {infrastructure.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Academics CTA */}
        <div className="bg-gradient-to-r from-navy-900 to-[#0B192C] text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
          <div>
            <h4 className="text-xl font-bold text-white">Interested in exploring our syllabus & subjects?</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Review complete semester-wise credit distributions and practical lab details.</p>
          </div>
          <Link
            to="/academics/labs-structure"
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center gap-2 whitespace-nowrap shadow-lg transition"
          >
            <span>Labs & Course Structure</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
