// Academics data for Department of Computer Application, T.P. College Madhepura
// Schema maps to future MongoDB 'academics' collection

export const academicsData = {
  programOverview: {
    title: "Bachelor of Computer Applications (BCA)",
    degree: "Undergraduate Degree (B.C.A.)",
    duration: "3 Years (6 Semesters)",
    intake: 60,
    affiliation: "B.N. Mandal University, Madhepura",
    curriculumFramework: "Choice Based Credit System (CBCS) & NEP Aligned",
    overview: "The Bachelor of Computer Applications (BCA) at T.P. College Madhepura is a premier 3-year full-time undergraduate program crafted to bridge the gap between academic theory and the ever-evolving IT software industry. Designed under B.N. Mandal University, the program provides comprehensive training in foundational computer science, object-oriented programming, modern web technologies, database management, cloud systems, and data analytics.",
    objectives: [
      "Develop strong analytical problem-solving and algorithmic thinking abilities.",
      "Impart hands-on mastery in industry programming languages including C, C++, Java, and Python.",
      "Instill robust understanding of database architectures, computer networking, and cyber security.",
      "Cultivate project engineering skills through mandatory semester capstone projects and lab exercises.",
      "Prepare graduates for top MCA programs (NITs, Central Universities) and high-growth IT industry roles."
    ],
    eligibility: {
      qualification: "Passed 10+2 / Intermediate examination in Science, Arts, or Commerce from BSEB / CBSE / ICSE or any recognized board.",
      subjectRequirement: "Must have studied Mathematics, Statistics, or Computer Science / Informatics Practices as one of the main/optional subjects in +2.",
      minimumMarks: "Minimum 45% aggregate marks (40% for SC/ST/OBC/EBC candidates).",
      selectionCriteria: "Merit-based admission following BNMU centralized counseling and college verification."
    },
    careerPathways: [
      { role: "Full-Stack Web Developer", salary: "₹4.5 - 9.0 LPA", icon: "Code" },
      { role: "Software Engineer / SDE-1", salary: "₹5.0 - 12.0 LPA", icon: "Terminal" },
      { role: "Database Administrator (DBA)", salary: "₹4.0 - 8.5 LPA", icon: "Database" },
      { role: "Cloud & Network Specialist", salary: "₹4.2 - 8.0 LPA", icon: "Cloud" },
      { role: "Data Analyst & Python Dev", salary: "₹4.8 - 10.0 LPA", icon: "TrendingUp" },
      { role: "Higher Studies (MCA / M.Sc CS / MBA IT)", salary: "Premier Tech Careers", icon: "GraduationCap" }
    ]
  },

  // Semester-wise detailed course structure
  semestersStructure: [
    {
      semester: 1,
      title: "Semester I - Foundations of Computing & Problem Solving",
      credits: 22,
      subjects: [
        { code: "BCA-101", name: "Fundamentals of Computers & Information Technology", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-102", name: "Programming Principles & Problem Solving in C", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-103", name: "Mathematical Foundation of Computer Science", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-104", name: "Business Communication & Technical Writing", type: "Theory", marks: 100, credits: 3 },
        { code: "BCA-105P", name: "C Programming Laboratory", type: "Practical", marks: 100, credits: 4 },
        { code: "BCA-106P", name: "PC Software & Office Productivity Lab", type: "Practical", marks: 50, credits: 3 }
      ]
    },
    {
      semester: 2,
      title: "Semester II - Data Structures & Object Oriented Systems",
      credits: 24,
      subjects: [
        { code: "BCA-201", name: "Data Structures Using C/C++", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-202", name: "Object Oriented Programming with C++", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-203", name: "Computer Organization & Architecture (COA)", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-204", name: "System Analysis and Design (SAD)", type: "Theory", marks: 100, credits: 3 },
        { code: "BCA-205P", name: "Data Structures Laboratory", type: "Practical", marks: 100, credits: 4 },
        { code: "BCA-206P", name: "OOP with C++ Laboratory", type: "Practical", marks: 100, credits: 5 }
      ]
    },
    {
      semester: 3,
      title: "Semester III - Database Architectures & System Software",
      credits: 24,
      subjects: [
        { code: "BCA-301", name: "Database Management Systems (DBMS)", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-302", name: "Operating Systems Principles & Linux", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-303", name: "Computer Networks & Data Communication", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-304", name: "Discrete Mathematical Structures", type: "Theory", marks: 100, credits: 3 },
        { code: "BCA-305P", name: "Oracle / MySQL & RDBMS Lab", type: "Practical", marks: 100, credits: 5 },
        { code: "BCA-306P", name: "Linux Shell Scripting & OS Lab", type: "Practical", marks: 100, credits: 4 }
      ]
    },
    {
      semester: 4,
      title: "Semester IV - Enterprise Java & Web Technologies",
      credits: 24,
      subjects: [
        { code: "BCA-401", name: "Core & Enterprise Java Programming", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-402", name: "Software Engineering & Testing Methodologies", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-403", name: "Web Technology & Internet Programming", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-404", name: "Numerical Methods & Statistical Techniques", type: "Theory", marks: 100, credits: 3 },
        { code: "BCA-405P", name: "Java Enterprise Programming Lab", type: "Practical", marks: 100, credits: 5 },
        { code: "BCA-406P", name: "Web Design & Frontend Development Lab", type: "Practical", marks: 100, credits: 4 }
      ]
    },
    {
      semester: 5,
      title: "Semester V - Python, Cloud & Cyber Security",
      credits: 24,
      subjects: [
        { code: "BCA-501", name: "Python Programming & Data Analytics", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-502", name: "Information Security & Cryptography", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-503", name: "Cloud Computing & Distributed Architectures", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-504", name: "Dot Net Framework & C# Programming", type: "Theory", marks: 100, credits: 3 },
        { code: "BCA-505P", name: "Python & Data Science Laboratory", type: "Practical", marks: 100, credits: 5 },
        { code: "BCA-506P", name: "Minor Project Work & Seminar", type: "Practical", marks: 100, credits: 4 }
      ]
    },
    {
      semester: 6,
      title: "Semester VI - Artificial Intelligence & Capstone Project",
      credits: 24,
      subjects: [
        { code: "BCA-601", name: "Artificial Intelligence & Machine Learning", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-602", name: "Mobile Application Development (Android/Flutter)", type: "Theory", marks: 100, credits: 4 },
        { code: "BCA-603", name: "E-Commerce & Cyber Law Compliance", type: "Theory", marks: 100, credits: 3 },
        { code: "BCA-604P", name: "AI & Mobile App Laboratory", type: "Practical", marks: 100, credits: 4 },
        { code: "BCA-605P", name: "Major Capstone Software Project & Dissertation", type: "Practical", marks: 200, credits: 7 },
        { code: "BCA-606V", name: "Comprehensive Grand Viva-Voce", type: "Viva", marks: 100, credits: 2 }
      ]
    }
  ],

  // BCA Labs detail
  labsDetails: [
    {
      id: "lab-c-ds",
      name: "Programming & Data Structures Lab",
      room: "Lab 101, IT Block",
      capacity: "35 Workstations",
      inCharge: "K. K. Bharti",
      software: ["GCC Compiler", "Code::Blocks", "Dev-C++", "Visual Studio Code", "Ubuntu Linux 22.04 LTS"],
      description: "Dedicated to building strong foundations in algorithmic problem solving, pointer manipulations, tree traversals, and dynamic memory architectures in C and C++.",
      keyPracticals: ["Memory management simulations", "AVL & B-Tree implementations", "Sorting algorithm benchmark analysis", "Custom graph traversal visualizer"]
    },
    {
      id: "lab-dbms-sql",
      name: "RDBMS & Database Engineering Lab",
      room: "Lab 102, IT Block",
      capacity: "30 Workstations",
      inCharge: "Ashish Kumar",
      software: ["Oracle 19c Client", "MySQL Server 8.0", "PostgreSQL", "MongoDB Compass", "DBeaver"],
      description: "Hands-on database design laboratory where students model complex ER schemas, optimize SQL queries, configure ACID transactions, and experiment with NoSQL collections.",
      keyPracticals: ["Multi-table normalized schema design", "Stored procedures, triggers & PL/SQL cursors", "Indexing & query optimization plans", "CRUD with MongoDB NoSQL collections"]
    },
    {
      id: "lab-web-java",
      name: "Full-Stack Web & Enterprise Java Lab",
      room: "Lab 103, IT Block",
      capacity: "35 Workstations",
      inCharge: "Akhilesh Kumar",
      software: ["Eclipse IDE", "IntelliJ IDEA", "Node.js & npm", "React.js Toolkit", "Apache Tomcat Server", "Postman"],
      description: "Modern web engineering environment where students learn responsive frontend architectures, RESTful API development, Servlet/JSP backend systems, and MERN stack applications.",
      keyPracticals: ["Single Page Applications with React & Tailwind", "RESTful API creation with Express and Node.js", "Java Servlets & Hibernate ORM integration", "Full-stack authentication and session management"]
    },
    {
      id: "lab-ai-network",
      name: "AI, Python & Advanced Network Lab",
      room: "Lab 104, IT Block",
      capacity: "35 Workstations",
      inCharge: "Ashim Anand",
      software: ["Anaconda Python 3.11", "Jupyter Notebooks", "PyTorch / Scikit-Learn", "Cisco Packet Tracer", "Wireshark", "VMware Workstation"],
      description: "Equipped with high-performance multi-core workstations for machine learning model training, network packet capture analysis, socket programming, and virtualization.",
      keyPracticals: ["Packet routing & VLAN configurations in Packet Tracer", "Network sniffing with Wireshark", "Supervised classification models with Scikit-Learn", "Data cleaning & exploratory analysis with Pandas"]
    }
  ],

  // Academic Calendar
  academicCalendar: {
    currentSession: "2026-2027",
    updatedDate: "September 2026",
    timeline: [
      {
        month: "July 2026",
        events: [
          { date: "Jul 01 - Jul 20", title: "Commencement of BCA Admissions for New Session (2026-29)", type: "Admission", status: "Completed" },
          { date: "Jul 25", title: "Orientation Day & Induction Program for 1st Year Students", type: "Academic", status: "Completed" },
          { date: "Jul 28", title: "Commencement of Regular Classes (Semesters I, III, V)", type: "Academic", status: "Completed" }
        ]
      },
      {
        month: "August 2026",
        events: [
          { date: "Aug 15", title: "Independence Day Celebration & Patriotic Tech Assembly", type: "Holiday / Event", status: "Completed" },
          { date: "Aug 20", title: "Departmental Coding Challenge (BCA Coding Club)", type: "Extracurricular", status: "Completed" },
          { date: "Aug 26 - Aug 28", title: "Janmashtami & Chehlum Holidays", type: "Holiday", status: "Completed" }
        ]
      },
      {
        month: "September 2026",
        events: [
          { date: "Sep 05", title: "Teachers' Day Celebration & Faculty Felicitation", type: "Event", status: "Completed" },
          { date: "Sep 15", title: "Engineers & Technocrats Day Special Lecture Series", type: "Academic", status: "Completed" },
          { date: "Sep 25 - Sep 30", title: "Release of 1st Mid-Semester Internal Exam Routine", type: "Examination", status: "Completed" }
        ]
      },
      {
        month: "October 2026",
        events: [
          { date: "Oct 02", title: "Mahatma Gandhi Jayanti (Observance & Campus Cleanliness)", type: "Holiday", status: "Upcoming" },
          { date: "Oct 12 - Oct 16", title: "1st Mid-Semester Continuous Evaluation (Semesters I, III, V)", type: "Examination", status: "Upcoming" },
          { date: "Oct 20 - Oct 29", title: "Durga Puja & Chhath Puja Autumn Vacations", type: "Holiday", status: "Upcoming" }
        ]
      },
      {
        month: "November 2026",
        events: [
          { date: "Nov 05", title: "Resumption of Classes & Lab Submissions", type: "Academic", status: "Upcoming" },
          { date: "Nov 14 - Nov 15", title: "Flagship Annual Tech Fest 'TechKriti 2026' Hackathon", type: "Major Event", status: "Upcoming" },
          { date: "Nov 25 - Nov 30", title: "Pre-University Model Test & Lab Record Verification", type: "Examination", status: "Upcoming" }
        ]
      },
      {
        month: "December 2026",
        events: [
          { date: "Dec 05 - Dec 18", title: "BNMU Odd Semester University Theory Examinations", type: "University Exam", status: "Upcoming" },
          { date: "Dec 20 - Dec 24", title: "Odd Semester External Practical Exams & Project Viva", type: "Examination", status: "Upcoming" },
          { date: "Dec 25 - Dec 31", title: "Winter Break", type: "Holiday", status: "Upcoming" }
        ]
      },
      {
        month: "January - June 2027",
        events: [
          { date: "Jan 05, 2027", title: "Commencement of Even Semesters (II, IV, VI)", type: "Academic", status: "Upcoming" },
          { date: "Feb 28, 2027", title: "National Science Day Exhibition & Project Demo", type: "Event", status: "Upcoming" },
          { date: "Mar 20 - Mar 25", title: "Even Semester Internal Assessment Tests", type: "Examination", status: "Upcoming" },
          { date: "May 15 - May 30", title: "BNMU Even Semester University Final Exams & Capstone Submission", type: "University Exam", status: "Upcoming" }
        ]
      }
    ]
  },

  // Computing Labs & Infrastructure details
  infrastructure: {
    title: "Computing Labs & IT Infrastructure",
    subtitle: "State-of-the-Art Computing Facilities, High-Speed Dedicated Fiber Network, and Modern Smart Learning Classrooms",
    stats: [
      { label: "High-End Computer Systems", value: "60+", desc: "Intel Core i7 & i5 Multi-core Processors" },
      { label: "Dedicated Fiber Leased Line", value: "1 Gbps", desc: "Redundant High-Speed Campus Internet" },
      { label: "Power Backup (Online UPS)", value: "100%", desc: "20 KVA Modular Heavy-Duty Dual Online UPS" },
      { label: "Smart Interactive Classrooms", value: "4 Rooms", desc: "4K Touch Interactive Panels & Audio Setup" }
    ],
    highlights: [
      {
        title: "High-Performance Workstations",
        description: "Equipped with Intel Core i7 12th Gen processors, 16GB DDR4 RAM, 512GB NVMe SSDs, and 24-inch Full HD IPS displays running dual boot OS (Windows 11 Pro & Ubuntu 22.04 LTS).",
        icon: "Cpu"
      },
      {
        title: "Campus-Wide High-Speed Wi-Fi & LAN",
        description: "1 Gbps optical fiber backbone connectivity with structured Cat6 Gigabit LAN cabling for each terminal and secure Wi-Fi access points across the IT Block.",
        icon: "Wifi"
      },
      {
        title: "Central Server & Cloud Staging Facility",
        description: "On-premise rack servers for student web hosting, Linux network administration training, private Git repository staging, and database clustering.",
        icon: "Server"
      },
      {
        title: "Smart Multimedia Interactive Theatres",
        description: "Lecture rooms outfitted with 75-inch 4K Interactive Flat Panels (IFP), high-fidelity acoustic audio systems, and digital recording capability for hybrid learning.",
        icon: "MonitorPlay"
      },
      {
        title: "100% Uninterrupted Power Architecture",
        description: "20 KVA dual online UPS setup integrated with a heavy-duty silent campus diesel generator to guarantee zero downtime during coding practicals and online assessments.",
        icon: "Zap"
      },
      {
        title: "Comprehensive Software Licenses & FOSS",
        description: "Rich development ecosystem including Visual Studio Code, IntelliJ IDEA, Oracle 19c, MySQL, Python Anaconda, Android Studio, Docker, Cisco Packet Tracer, and Linux distributions.",
        icon: "ShieldCheck"
      }
    ],
    rules: [
      "All students must carry their valid college identity card upon entering the laboratory.",
      "Food, beverages, and personal external storage devices without authorization are strictly prohibited.",
      "Students must maintain strict silence and work on assigned terminals.",
      "Lab records and practical files must be maintained and verified on a weekly schedule by the faculty in-charge.",
      "Any intentional tampering with system configuration or network cables will attract disciplinary penalties."
    ]
  }
};
