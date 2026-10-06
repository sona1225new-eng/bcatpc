# Department of Computer Application (BCA) - T.P. College Madhepura
**A Premier Constituent Unit of B.N. Mandal University, Madhepura, Bihar**

A complete, production-ready MERN-architected web application for the **Department of Computer Application (BCA)** at **Thakur Prasad College (T.P. College), Madhepura**, built with React, Vite, Tailwind CSS v4, and React Router.

---

## 🎨 Visual Design & Aesthetics
- **Theme**: Deep Navy (`#0B192C`), Midnight Slate (`#070D18`), Royal Blue (`#1D4ED8`), Gold/Amber Accents (`#F59E0B`), and Wine/Burgundy Accents (`#881337`).
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Outfit*, and *Cinzel* for luxury academic titles).
- **Aesthetic**: Rounded cards, soft shadows, subtle borders, glowing ambient highlights, glassmorphism navigation, and responsive layouts.

---

## 🚀 Key Features & Navigation

### 1. Navigation & Dropdowns
- **Academics Dropdown**:
  - `BCA Labs & Structure` (`/academics/labs-structure`)
  - `Academic Calendar` (`/academics/calendar`)
  - `Computing Labs & Infrastructure` (`/academics/computing-labs`)
- **Faculties Dropdown**:
  - Dynamically populated from `facultyService` (Prof. (Dr.) Rajesh Kumar Jha, Dr. Anand Mohan Singh, Prof. Smriti Kumari, Prof. Manish Kumar Verma)
  - Links to individual profile pages (`/faculties/:id`)
- **PYQs Dropdown**:
  - Dynamically populated 6 Semesters (`/pyqs/semester-1` to `/pyqs/semester-6`)
- **Direct Nav Items**: Home, Campus Updates, Blogs, Gallery, Contact Us, and Admission Apply Now CTA.
- **Mobile Menu**: Smooth hamburger drawer with collapsible accordions for Academics, Faculties, and PYQs.

### 2. Homepage Sections
1. **Top Information Bar**: Contact helpline numbers, official email, BNMU affiliation, and NAAC B accreditation badge.
2. **Main Navigation**: Logo emblem, department branding, dropdowns, and Apply Now pill button.
3. **Hero Section**: Gold-highlighted headline, program overview, CTA buttons (*Explore BCA*, *Browse PYQs*, *Apply Online*), and 4 right-side info highlight cards (*3-Year Program*, *6-Semesters*, *Top IT Recruiters*, *Hands-on Coding Labs*).
4. **Latest Updates Ticker**: Gold animated scrolling ticker with dynamic notice circulars.
5. **Important Notice Board**: 3-column categorized cards for *Official Circular / Notice*, *Examinations / Exam Updates*, and *Campus Life / News & Events*.
6. **About Department**: 2-column layout with history, highlights checklist, and campus photo overlay card.
7. **Vision & Mission**: Luxury glassmorphism cards on starry midnight navy with bottom feature pills.
8. **Previous Year Papers & Question Bank**: Interactive semester filter tabs, search bar, year filter, and PYQ cards with verified PDF download buttons.
9. **Campus Updates & Blogs**: Latest news, hackathon victories, lab upgrades, and technical articles.
10. **Footer**: 4-column academic footer with map, quick links, BNMU compliance, and office hours.

### 3. Dedicated Inner Pages
- `/academics` - Program overview, objectives, eligibility, CBCS structure, and career pathways.
- `/academics/labs-structure` - Semester-by-semester course codes, credit distribution, and lab equipment.
- `/academics/calendar` - Academic timeline with interactive activity filters (Exams, Holidays, Admissions).
- `/academics/computing-labs` - Technical hardware/software specs, network configuration, and lab rules.
- `/faculties` & `/faculties/:id` - Faculty directory and detailed academic profiles with publications and office hours.
- `/campus-updates` & `/campus-updates/:id` - Department news stories and related articles.
- `/blogs` & `/blogs/:id` - Full-length technical tutorials and career guides.
- `/notices` & `/notices/:id` - Official circulars, reference numbers, and download attachments.
- `/pyqs` & `/pyqs/:semesterId` & `/pyqs/:id` - 6 Semesters archive with search, year filter, and download CTAs.
- `/gallery` - Photo stream with interactive category filters and Lightbox modal.
- `/contact` - Centralized contact details, inquiry form with validation, and Google Maps embed.
- `*` - Academic 404 error page.

---

## 🏗️ Architecture & Future MERN Integration

The frontend has been built with clean service-layer abstraction so that connecting the upcoming Node.js + Express.js + MongoDB backend requires **zero UI rewrites**:

```
src/
├── config/       # Central site and navigation configuration
├── data/         # Mock data matching future MongoDB schemas
├── services/     # API Service Layer (facultyService, noticeService, pyqService, etc.)
├── hooks/        # React custom hooks (useNotices, usePYQs, useFaculties, etc.)
├── components/   # Reusable cards, dropdowns, feedback states, headers, layout
├── pages/        # All public route pages
├── routes/       # Central React Router definition (AppRoutes.jsx)
└── layouts/      # MainLayout wrapper
```

### Switching to Live Backend:
To connect to the future Node.js/Express API, simply update `src/services/api.js`:
```javascript
const API_CONFIG = {
  USE_MOCK_API: false,
  BASE_URL: "http://localhost:5000/api",
};
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, React Router v7, React Icons, Lucide React, Framer Motion
- **Future Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication
- **Future Admin**: Dedicated React Admin Dashboard for content management

---

## 💻 Running the Project Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
