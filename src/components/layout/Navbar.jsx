import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { HiMenu, HiChevronDown, HiOutlineArrowRight, HiUserCircle } from 'react-icons/hi';
import DropdownMenu from './DropdownMenu';
import MobileMenu from './MobileMenu';
import { facultyService } from '../../services/facultyService';
import { pyqService } from '../../services/pyqService';
import { siteConfig } from '../../config/siteConfig';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'academics' | 'faculties' | 'pyqs' | null
  const [facultyDropdownItems, setFacultyDropdownItems] = useState([]);
  const [pyqDropdownItems, setPyqDropdownItems] = useState([]);
  
  const dropdownTimeoutRef = useRef(null);
  const navContainerRef = useRef(null);
  const location = useLocation();

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch dynamic faculties and semesters data from service layer (NOT hardcoded)
  useEffect(() => {
    async function loadDynamicNavData() {
      try {
        const [facRes, pyqRes] = await Promise.all([
          facultyService.getNavSummary(),
          pyqService.getSemestersList(),
        ]);

        if (facRes.data) {
          setFacultyDropdownItems(
            facRes.data.map((f) => ({
              id: f.id,
              href: `/faculties/${f.id}`,
              label: f.name,
              subtitle: f.shortDesignation,
            }))
          );
        }

        if (pyqRes.data) {
          setPyqDropdownItems(
            pyqRes.data.map((sem) => ({
              id: sem.id,
              href: `/pyqs/${sem.id}`,
              label: `${sem.name} (${sem.roman})`,
              subtitle: sem.desc,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load nav dynamic items:", err);
      }
    }
    loadDynamicNavData();
  }, []);

  // Academics dropdown static items
  const academicItems = [
    { href: "/academics/labs-structure", label: "BCA Labs & Structure", subtitle: "Curriculum & syllabus details" },
    { href: "/academics/calendar", label: "Academic Calendar", subtitle: "Exam & session schedules" },
    { href: "/academics/computing-labs", label: "Computing Labs & Infrastructure", subtitle: "Facilities & hardware specs" },
  ];

  const handleMouseEnter = (dropdownKey) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdownKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#233B5D] text-white shadow-xl border-b border-slate-800/90 select-none">
      <div
        ref={navContainerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4"
      >
        {/* Logo & College Identity */}
        <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
          {/* Emblem Icon */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gold-500 via-gold-400 to-gold-500 p-[2px] shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#233B5D] flex items-center justify-center font-black text-gold-400 text-xs tracking-wider border border-gold-400/40">
              BCA
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-gold-400 transition-colors">
                T.P. College Madhepura
              </span>
              <span className="hidden sm:inline-block px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-500 text-slate-950">
                B.C.A.
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Department of Computer Application
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-gold-400' : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            Home
          </NavLink>

          {/* Academics Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('academics')}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to="/academics"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                  isActive || activeDropdown === 'academics'
                    ? 'text-gold-400'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <span>Academics</span>
              <HiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'academics' ? 'rotate-180 text-gold-400' : 'text-slate-300'
                }`}
              />
            </NavLink>

            {activeDropdown === 'academics' && (
              <DropdownMenu
                items={academicItems}
                onItemClick={handleDropdownItemClick}
                width="w-72"
              />
            )}
          </div>

          {/* Faculties Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('faculties')}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to="/faculties"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                  isActive || activeDropdown === 'faculties'
                    ? 'text-gold-400'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <span>Faculties</span>
              <HiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'faculties' ? 'rotate-180 text-gold-400' : 'text-slate-300'
                }`}
              />
            </NavLink>

            {activeDropdown === 'faculties' && (
              <DropdownMenu
                items={facultyDropdownItems}
                onItemClick={handleDropdownItemClick}
                width="w-80"
              />
            )}
          </div>

          {/* PYQs Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('pyqs')}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to="/pyqs"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                  isActive || activeDropdown === 'pyqs'
                    ? 'text-gold-400'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <span>PYQs</span>
              <span className="text-[10px] bg-gold-500 text-slate-950 font-bold px-1 py-0.5 rounded leading-none">
                New
              </span>
              <HiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'pyqs' ? 'rotate-180 text-gold-400' : 'text-slate-300'
                }`}
              />
            </NavLink>

            {activeDropdown === 'pyqs' && (
              <DropdownMenu
                items={pyqDropdownItems}
                onItemClick={handleDropdownItemClick}
                width="w-72"
              />
            )}
          </div>

          {/* Gallery */}
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-gold-400' : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            Gallery
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-gold-400' : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Actions: Apply Now Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Apply Now Pill Button styled exactly as in reference */}
          <Link
            to="/contact#admission-inquiry"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-800 text-white shadow-md shadow-navy-900/30 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>APPLY NOW</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>

          {/* Student/Faculty Portal Indicator */}
          <Link
            to="/notices"
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-gold-400 transition"
            title="Student Notices & Circulars"
          >
            <HiUserCircle className="w-6 h-6" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 lg:hidden transition"
            aria-label="Toggle Mobile Navigation"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        academicItems={academicItems}
        facultyItems={facultyDropdownItems}
        pyqItems={pyqDropdownItems}
      />
    </header>
  );
}
