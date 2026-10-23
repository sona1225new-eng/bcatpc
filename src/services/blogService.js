import { blogsData } from '../data/blogs';
import API_CONFIG, { delay, createApiResponse, ApiError } from './api';

export const blogService = {
  /**
   * Fetch all blogs
   * Future mapping: GET /api/blogs
   */
  async getAll({ category = "All", search = "", limit = null } = {}) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const params = new URLSearchParams();
        if (category && category !== "All") params.append("category", category);
        if (search) params.append("search", search);
        if (limit) params.append("limit", limit);
        const res = await fetch(`${API_CONFIG.BASE_URL}/blogs?${params.toString()}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback blogs:", err.message);
      }
    }

    await delay();
    let filtered = blogsData
      .filter((blog) => blog.status === "published")
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.publishedDate || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.publishedDate || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

    if (category && category !== "All") {
      filtered = filtered.filter(
        (b) => b.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (limit && typeof limit === "number") {
      filtered = filtered.slice(0, limit);
    }

    return createApiResponse(filtered, "Blogs retrieved successfully");
  },

  /**
   * Fetch blog by ID or Slug
   * Future mapping: GET /api/blogs/:id
   */
  async getById(idOrSlug) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/blogs/${idOrSlug}`);
      if (!res.ok) throw new ApiError("Blog not found", res.status);
      return res.json();
    }

    await delay();
    const blog = blogsData.find(
      (b) => b.id === idOrSlug || b.slug === idOrSlug || b._id === idOrSlug
    );

    if (!blog) {
      throw new ApiError(`Blog '${idOrSlug}' not found.`, 404);
    }

    return createApiResponse(blog, "Blog post details retrieved");
  },

  async getLatest(limit = 3) {
    return this.getAll({ limit });
  }
};
