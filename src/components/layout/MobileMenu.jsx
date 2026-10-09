import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HiChevronDown, HiX, HiOutlineAcademicCap, HiOutlineArrowRight } from 'react-icons/hi';
import { siteConfig } from '../../config/siteConfig';

export default function MobileMenu({
  isOpen,
  onClose,
  academicItems = [],
  facultyItems = [],
  pyqItems = [],
}) {
  const [openSection, setOpenSection] = useState(null);

  if (!isOpen) return null;

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNavClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-950/95 backdrop-blur-xl animate-fadeIn text-white">
      {/* Top Header inside Drawer */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-500 to-gold-400 flex items-center justify-center text-slate-950 font-black text-sm">
            TPC
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">T.P. College Madhepura</div>
            <div className="text-[11px] text-gold-400 font-semibold">Dept. of Computer Application</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          aria-label="Close Menu"
        >
          <HiX className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1.5 divide-y divide-slate-800/50">
        <div className="space-y-1 pb-3">
          {/* Home */}
          <NavLink
            to="/"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            Home
          </NavLink>

          {/* Academics Accordion */}
          <div>
            <div className="flex items-center justify-between rounded-xl overflow-hidden hover:bg-slate-800">
              <NavLink
                to="/academics"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex-1 px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'text-gold-400 font-bold' : 'text-slate-200'
                  }`
                }
              >
                Academics
              </NavLink>
              <button
                type="button"
                onClick={() => toggleSection('academics')}
                className="px-4 py-3 text-slate-400 hover:text-white"
                aria-label="Expand Academics"
              >
                <HiChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSection === 'academics' ? 'rotate-180 text-gold-400' : ''
                  }`}
                />
              </button>
            </div>

            {openSection === 'academics' && (
              <div className="ml-4 mt-1 pl-3 border-l-2 border-gold-500/40 space-y-1 py-1">
                {academicItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive ? 'text-gold-400 bg-slate-800/80 font-bold' : 'text-slate-300 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Faculties Accordion */}
          <div>
            <div className="flex items-center justify-between rounded-xl overflow-hidden hover:bg-slate-800">
              <NavLink
                to="/faculties"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex-1 px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'text-gold-400 font-bold' : 'text-slate-200'
                  }`
                }
              >
                Faculties
              </NavLink>
              <button
                type="button"
                onClick={() => toggleSection('faculties')}
                className="px-4 py-3 text-slate-400 hover:text-white"
                aria-label="Expand Faculties"
              >
                <HiChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSection === 'faculties' ? 'rotate-180 text-gold-400' : ''
                  }`}
                />
              </button>
            </div>

            {openSection === 'faculties' && (
              <div className="ml-4 mt-1 pl-3 border-l-2 border-gold-500/40 space-y-1 py-1">
                {facultyItems.map((fac) => (
                  <NavLink
                    key={fac.href}
                    to={fac.href}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive ? 'text-gold-400 bg-slate-800/80 font-bold' : 'text-slate-300 hover:text-white'
                      }`
                    }
                  >
                    <div className="font-semibold">{fac.label}</div>
                    {fac.subtitle && <div className="text-[10px] text-slate-400">{fac.subtitle}</div>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* PYQs Accordion */}
          <div>
            <div className="flex items-center justify-between rounded-xl overflow-hidden hover:bg-slate-800">
              <NavLink
                to="/pyqs"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex-1 px-4 py-3 text-sm font-semibold transition flex items-center justify-between ${
                    isActive ? 'text-gold-400 font-bold' : 'text-slate-200'
                  }`
                }
              >
                <span>PYQs</span>
                <span className="text-[10px] bg-gold-500 text-slate-950 font-bold px-1.5 py-0.5 rounded mr-2">6 Sem</span>
              </NavLink>
              <button
                type="button"
                onClick={() => toggleSection('pyqs')}
                className="px-4 py-3 text-slate-400 hover:text-white"
                aria-label="Expand PYQs"
              >
                <HiChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSection === 'pyqs' ? 'rotate-180 text-gold-400' : ''
                  }`}
                />
              </button>
            </div>

            {openSection === 'pyqs' && (
              <div className="ml-4 mt-1 pl-3 border-l-2 border-gold-500/40 grid grid-cols-2 gap-1 py-1">
                {pyqItems.map((sem) => (
                  <NavLink
                    key={sem.href}
                    to={sem.href}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive ? 'text-gold-400 bg-slate-800/80 font-bold' : 'text-slate-300 hover:text-white'
                      }`
                    }
                  >
                    {sem.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Notices */}
          <NavLink
            to="/notices"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            Notices & Circulars
          </NavLink>

          {/* Gallery */}
          <NavLink
            to="/gallery"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            Gallery
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            Contact Us
          </NavLink>
        </div>

        {/* CTA in Drawer */}
        <div className="pt-4 space-y-3">
          <Link
            to="/contact#admission-inquiry"
            onClick={handleNavClick}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <span>APPLY NOW (Session {siteConfig.admissions.session})</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
