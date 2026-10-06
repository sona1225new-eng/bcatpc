import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Pages
import HomePage from '../pages/HomePage';

// Academics
import AcademicsPage from '../pages/Academics/AcademicsPage';
import LabsStructurePage from '../pages/Academics/LabsStructurePage';
import AcademicCalendarPage from '../pages/Academics/AcademicCalendarPage';
import ComputingLabsPage from '../pages/Academics/ComputingLabsPage';

// Faculties
import FacultiesPage from '../pages/Faculties/FacultiesPage';
import FacultyDetailPage from '../pages/Faculties/FacultyDetailPage';

// Campus Updates
import CampusUpdatesPage from '../pages/CampusUpdates/CampusUpdatesPage';
import CampusUpdateDetailPage from '../pages/CampusUpdates/CampusUpdateDetailPage';

// Blogs
import BlogsPage from '../pages/Blogs/BlogsPage';
import BlogDetailPage from '../pages/Blogs/BlogDetailPage';

// Notices
import NoticesPage from '../pages/Notices/NoticesPage';
import NoticeDetailPage from '../pages/Notices/NoticeDetailPage';

// PYQs
import PYQsHubPage from '../pages/PYQs/PYQsHubPage';
import SemesterPYQPage from '../pages/PYQs/SemesterPYQPage';
import PYQDetailPage from '../pages/PYQs/PYQDetailPage';

// Gallery & Contact
import GalleryPage from '../pages/Gallery/GalleryPage';
import ContactPage from '../pages/Contact/ContactPage';

// 404
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Academics */}
        <Route path="academics" element={<AcademicsPage />} />
        <Route path="academics/labs-structure" element={<LabsStructurePage />} />
        <Route path="academics/calendar" element={<AcademicCalendarPage />} />
        <Route path="academics/computing-labs" element={<ComputingLabsPage />} />

        {/* Faculties */}
        <Route path="faculties" element={<FacultiesPage />} />
        <Route path="faculties/:id" element={<FacultyDetailPage />} />

        {/* Campus Updates */}
        <Route path="campus-updates" element={<CampusUpdatesPage />} />
        <Route path="campus-updates/:id" element={<CampusUpdateDetailPage />} />

        {/* Blogs */}
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:id" element={<BlogDetailPage />} />

        {/* Notices */}
        <Route path="notices" element={<NoticesPage />} />
        <Route path="notices/:id" element={<NoticeDetailPage />} />

        {/* PYQs Hub & Semesters */}
        <Route path="pyqs" element={<PYQsHubPage />} />
        <Route path="pyqs/semester-1" element={<SemesterPYQPage />} />
        <Route path="pyqs/semester-2" element={<SemesterPYQPage />} />
        <Route path="pyqs/semester-3" element={<SemesterPYQPage />} />
        <Route path="pyqs/semester-4" element={<SemesterPYQPage />} />
        <Route path="pyqs/semester-5" element={<SemesterPYQPage />} />
        <Route path="pyqs/semester-6" element={<SemesterPYQPage />} />
        <Route path="pyqs/:id" element={<PYQDetailPage />} />

        {/* Gallery */}
        <Route path="gallery" element={<GalleryPage />} />

        {/* Contact */}
        <Route path="contact" element={<ContactPage />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
