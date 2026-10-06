import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineLocationMarker, 
  HiOutlineArrowRight, 
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { siteConfig } from '../../config/siteConfig';

export default function Footer() {
  return (
    <footer className="bg-[#070D18] text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: College & Department Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#070D18] flex items-center justify-center font-black text-amber-400 text-xs">
                  TPC
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {siteConfig.collegeName}
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  {siteConfig.departmentName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              A premier constituent unit of B.N. Mandal University, Madhepura, imparting excellence in technical education, software development, computing labs, and industry-oriented computer applications.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <HiOutlineLocationMarker className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HiOutlinePhone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{siteConfig.contact.phone} / {siteConfig.contact.mobile}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HiOutlineMail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>BCA Program Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/labs-structure" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Labs & Course Structure</span>
                </Link>
              </li>
              <li>
                <Link to="/faculties" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Faculty Directory</span>
                </Link>
              </li>
              <li>
                <Link to="/campus-updates" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Campus Updates</span>
                </Link>
              </li>
              <li>
                <Link to="/pyqs" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>PYQs & Question Bank</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Department Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Contact & Admissions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Resources & Portal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Information & Info</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/notices" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Official Circulars & Notices</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/calendar" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Academic Calendar 2026-27</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/computing-labs" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Computing Labs & Infrastructure</span>
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Tech Blogs & Articles</span>
                </Link>
              </li>
              <li>
                <a
                  href="http://bnmu.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-blue-400" />
                  <span>B.N. Mandal University (BNMU) Portal</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anti-Ragging & Grievance Cell</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit Us & Admission Box */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Visit Us</span>
            </h4>

            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  BCA IT Block
                </span>
                <span className="text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Open 9:30 - 4:30
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Main Campus, T.P. College, Stadium Road, Madhepura, Bihar - 852113.
              </p>

              <Link
                to="/contact"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
              >
                <span>GET IN TOUCH</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Sub-Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4 text-[11px] sm:text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 Department of Computer Application, T.P. College Madhepura (B.N. Mandal University). All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/contact" className="hover:text-amber-400">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-400">Terms of Use</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-400">Helpdesk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
