import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { HiMenu, HiChevronDown } from 'react-icons/hi';
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
    <header className="sticky top-0 z-40 bg-[#F3F3EF] text-[#10294B] shadow-sm border-b border-[#E7E5DF] select-none">
      <div
        ref={navContainerRef}
        className="max-w-[1472px] mx-auto px-4 sm:px-6 lg:px-8 2xl:w-[calc(100%-3rem)] 2xl:pl-1 2xl:pr-14 h-[76px] 2xl:h-[92px] flex items-center justify-between gap-4"
      >
        {/* Logo & College Identity */}
        <Link to="/" className="flex items-center gap-[18px] group flex-shrink-0">
          <span className="w-[50px] h-[50px] 2xl:w-[62px] 2xl:h-[62px] p-1.5 bg-[#F3F3EF] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/college-logo.png"
              alt="T.P. College Madhepura emblem"
              className="w-full h-full object-contain"
            />
          </span>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-[15px] sm:text-lg 2xl:text-[23px] font-black tracking-tight text-[#10294B] group-hover:text-[#C58A20] transition-colors">
                T.P. College Madhepura
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--college-logo-red)] text-white">
                B.C.A.
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-[color:var(--college-logo-red)] group-hover:text-[#10294B] transition-colors">
              Department of Computer Application
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex flex-1 items-center justify-center gap-1">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-[#C58A20]' : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
              }`
            }
          >
            Home
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-[#C58A20]' : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
              }`
            }
          >
            About
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
                `flex items-center gap-1 px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                  isActive || activeDropdown === 'academics'
                      ? 'text-[#C58A20]'
                      : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
                }`
              }
            >
              <span>Academics</span>
              <HiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'academics' ? 'rotate-180 text-[#C58A20]' : 'text-[#243B5A]'
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

          <NavLink
            to="/campus-updates"
            className={({ isActive }) =>
              `px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-[#C58A20]' : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
              }`
            }
          >
            Updates
          </NavLink>

          {/* Faculties Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('faculties')}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to="/faculties"
              className={({ isActive }) =>
                `flex items-center gap-1 px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                  isActive || activeDropdown === 'faculties'
                      ? 'text-[#C58A20]'
                      : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
                }`
              }
            >
              <span>Faculties</span>
              <HiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'faculties' ? 'rotate-180 text-[#C58A20]' : 'text-[#243B5A]'
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
                `flex items-center gap-1 px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                  isActive || activeDropdown === 'pyqs'
                      ? 'text-[#C58A20]'
                      : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
                }`
              }
            >
              <span>PYQs</span>
              <span className="text-[10px] bg-[var(--college-logo-red)] text-white font-bold px-1 py-0.5 rounded leading-none">
                New
              </span>
              <HiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'pyqs' ? 'rotate-180 text-[#C58A20]' : 'text-[#243B5A]'
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
              `px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-[#C58A20]' : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
              }`
            }
          >
            Gallery
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-2 py-2 rounded-lg text-sm font-semibold transition duration-150 ${
                isActive ? 'text-[#C58A20]' : 'text-[#10294B] hover:text-[#C58A20] hover:bg-[#E9E8E2]'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center xl:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-[#10294B] hover:bg-[#E9E8E2] xl:hidden transition"
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
