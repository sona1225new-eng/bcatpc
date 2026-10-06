import { pyqsData, semestersList } from '../data/pyqs';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

export const pyqService = {
  /**
   * Get all semesters metadata
   */
  async getSemestersList() {
    await delay(20);
    return createApiResponse(semestersList, "Semesters list retrieved");
  },

  /**
   * Fetch all PYQs with optional filtering
   * Future mapping: GET /api/pyqs
   */
  async getAll({ semester = "all", subject = "", year = "all", search = "", limit = null } = {}) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const params = new URLSearchParams();
        if (semester && semester !== "all") params.append("semester", semester);
        if (subject) params.append("subject", subject);
        if (year && year !== "all") params.append("year", year);
        if (search) params.append("search", search);
        if (limit) params.append("limit", limit);
        const res = await fetch(`${API_CONFIG.BASE_URL}/pyqs?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback PYQs:", err.message);
      }
    }

    await delay();
    let filtered = [...pyqsData];

    if (semester && semester !== "all") {
      filtered = filtered.filter(
        (p) => p.semester.toLowerCase() === semester.toLowerCase() || String(p.semesterNumber) === String(semester)
      );
    }

    if (year && year !== "all") {
      filtered = filtered.filter((p) => String(p.year) === String(year));
    }

    if (subject && subject.trim()) {
      filtered = filtered.filter((p) => p.subject.toLowerCase().includes(subject.toLowerCase()));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.subject.toLowerCase().includes(q) ||
          p.subjectCode.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          String(p.year).includes(q) ||
          (p.topicsCovered && p.topicsCovered.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (limit && typeof limit === "number") {
      filtered = filtered.slice(0, limit);
    }

    return createApiResponse(filtered, "PYQs fetched successfully");
  },

  /**
   * Fetch PYQs by semester ID (e.g., 'semester-1', 'semester-2')
   * Future mapping: GET /api/pyqs/semester/:semester
   */
  async getBySemester(semester) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/pyqs/semester/${semester}`);
      if (!res.ok) throw new ApiError(`Failed to fetch PYQs for semester ${semester}`, res.status);
      return res.json();
    }

    await delay();
    const formattedSem = semester.startsWith("semester-") ? semester : `semester-${semester}`;
    const semInfo = semestersList.find((s) => s.id === formattedSem || String(s.number) === String(semester));
    const papers = pyqsData.filter(
      (p) => p.semester === formattedSem || String(p.semesterNumber) === String(semester)
    );

    return createApiResponse({
      semester: semInfo || { id: formattedSem, name: `Semester ${semester}`, roman: `Semester ${semester}` },
      papers,
    });
  },

  /**
   * Fetch a single PYQ paper by ID
   * Future mapping: GET /api/pyqs/:id
   */
  async getById(id) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/pyqs/${id}`);
      if (!res.ok) throw new ApiError("PYQ not found", res.status);
      return res.json();
    }

    await delay();
    const paper = pyqsData.find((p) => p.id === id || p._id === id);
    if (!paper) {
      throw new ApiError(`Question paper '${id}' not found.`, 404);
    }

    return createApiResponse(paper, "PYQ details retrieved");
  }
};
