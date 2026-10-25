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
    <footer className="bg-[#233B5D] text-slate-300 border-t border-slate-800 text-xs sm:text-sm">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: College & Department Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 p-1.5 rounded-lg bg-[#FFFDF7] flex items-center justify-center flex-shrink-0">
                <img
                  src="/college-logo.png"
                  alt="T.P. College Madhepura emblem"
                  className="w-full h-full object-contain"
                />
              </span>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {siteConfig.collegeName}
                </h3>
                <p className="text-xs text-gold-400 font-semibold">
                  {siteConfig.departmentName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A premier constituent unit of B.N. Mandal University, Madhepura, imparting excellence in technical education, software development, computing labs, and industry-oriented computer applications.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <HiOutlineLocationMarker className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HiOutlinePhone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{siteConfig.contact.phone} / {siteConfig.contact.mobile}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HiOutlineMail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>BCA Program Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/labs-structure" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Labs & Course Structure</span>
                </Link>
              </li>
              <li>
                <Link to="/faculties" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Faculty Directory</span>
                </Link>
              </li>
              <li>
                <Link to="/campus-updates" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Campus Updates</span>
                </Link>
              </li>
              <li>
                <Link to="/pyqs" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>PYQs & Question Bank</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Department Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Contact & Admissions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Resources & Portal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span>Information & Info</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/notices" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Official Circulars & Notices</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/calendar" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Academic Calendar 2026-27</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/computing-labs" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Computing Labs & Infrastructure</span>
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Tech Blogs & Articles</span>
                </Link>
              </li>
              <li>
                <a
                  href="http://bnmu.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-gold-400" />
                  <span>B.N. Mandal University (BNMU) Portal</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Anti-Ragging & Grievance Cell</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <HiOutlineArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Helpdesk</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit Us & Admission Box */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span>Visit Us</span>
            </h4>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.130140522364!2d86.7958578745153!3d25.930951301592522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ee37bce0b2539d%3A0x3e402c4bbc630742!2sT%20P%20College%20Play%20Ground!5e0!3m2!1sen!2sin!4v1792940807398!5m2!1sen!2sin"
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: '0.5rem' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="T P College Play Ground, Madhepura"
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright Sub-Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4 text-[11px] sm:text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2 text-center leading-relaxed">
          <p className="text-slate-300">
            Developed &amp; Maintained under the supervision of Abhishek Sinha (Faculty - T.P.College)
          </p>
          <p>
            © 2026 Department of Computer Application, T.P. College Madhepura (B.N. Mandal University). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
